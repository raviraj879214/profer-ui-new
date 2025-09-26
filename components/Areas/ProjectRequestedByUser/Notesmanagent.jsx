import { useEffect, useRef, useState } from "react";

export function NotesTimeLine({ companyid  ,projectstatus   }) {
    const [noteslist, setnoteslist] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [loading, setLoading] = useState(false); // 🔹 New loading state
    const [notescount,setnotescount] = useState(0);
    const scrollRef = useRef(null);

    const fetchnotesfromcompany = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/get-request-project-info/${companyid}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
            },
        });
        if (res.ok) {
            const result = await res.json();
            if (result.status === 200) {
                setnoteslist(result.data);
                setnotescount(result.data.length);
            }
        }
    };

    const postOrUpdateNote = async () => {
        debugger;
        if (!newComment.trim()) return;
        setLoading(true); // 🔹 Start loading

        const url = editingNoteId
            ? `${process.env.NEXT_PUBLIC_URL}/api/update-request-project-info`
            : `${process.env.NEXT_PUBLIC_URL}/api/create-request-project-info`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("Admintoken")}`,
            },
            body: JSON.stringify(
                editingNoteId
                    ? { id: editingNoteId, comment: newComment }
                    : { requestid: companyid, comment: newComment }
            ),
        });

        setLoading(false); // 🔹 End loading

        if (res.ok) {
            const result = await res.json();
            if (result.status === 200) {
                setNewComment("");
                setEditingNoteId(null);
                fetchnotesfromcompany();
            }
        }
    };

    useEffect(() => { fetchnotesfromcompany(); }, []);
    useEffect(() => {
        if (scrollRef.current)
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [noteslist]);

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
            { label: 'second', seconds: 1 },
        ];
        for (let interval of intervals) {
            const count = Math.floor(seconds / interval.seconds);
            if (count >= 1) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
        return "just now";
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl h-[90vh] ml-4 p-5 relative flex flex-col">
           
            <h2 className="font-semibold text-gray-900 mb-5 text-lg"> {projectstatus == "0" ? "Request More Info" : "Requested Logs"} </h2>

            <div ref={scrollRef} className="relative border-l-2 border-gray-200 pl-6 space-y-8 flex-1 overflow-y-auto pr-3">
                {noteslist.length > 0 ? noteslist.map((data) => (
                    <div className="relative" key={data.id}>
                        <div className="absolute -left-[10px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-100"></div>
                        <p className="text-sm text-gray-900 font-medium  ml-5">
                            <span className="font-normal text-gray-500">{data.comment}</span>
                        </p>
                        <span className="text-xs text-gray-400">
                            Requested by {data.users?.firstname || "Unknown"} • {formatTimeAgo(data.createdDate)}
                            {data.updatedBy && (
                                <> • Edited by {data.editors?.firstname || "Unknown"} ({formatTimeAgo(data.updatedDate)})</>
                            )}
                        </span>
                        <div>
                            {/* <button
                                onClick={() => { setEditingNoteId(data.id); setNewComment(data.comment); }}
                                className="text-blue-500 text-xs mt-1 hover:underline"
                            >
                                Edit
                            </button> */}
                        </div>
                    </div>
                )) : <p className="text-gray-400 text-sm">No notes yet.</p>}
            </div>
            {projectstatus === "0" && (
                <div className="mt-4 border-t border-gray-200 pt-4 flex flex-col gap-2">
                    <textarea
                        placeholder="Add your request..."
                        value={newComment}
                        rows={5}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading} // 🔹 Disable while loading
                    />
                    <button
                        onClick={postOrUpdateNote}
                        className={`self-end bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? "Requesting..." : editingNoteId ? "Update" : "Request"}
                    </button>
                </div>

            )}
           

        </div>
    );
}
