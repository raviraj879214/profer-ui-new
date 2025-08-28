



export function ProsList(){


    return(<>
     {/* Call to Action */}
        <section className="mt-20 text-center max-w-md mx-auto">
          <img
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/bfd2e70d-953f-4cd6-8c0b-cd8e7d55f1f1.png"
            alt="Woman at desk"
            className="mx-auto mb-6 max-h-40"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fabdb81f-a141-4d60-886b-a9c02b08ad9f.png";
            }}
          />
          <h2 className="text-xl font-semibold mb-2">What are you waiting on?</h2>
          <p className="text-gray-600 mb-6">
            Start your next project with our{" "}
            <strong>
              Project <span className="text-red-500">Auction</span>
            </strong>
            ™. With our money-back guarantee, your project is in good hands.
          </p>
          <button className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded shadow transition">
            Get Started
          </button>
        </section>

    
    
    </>);
}