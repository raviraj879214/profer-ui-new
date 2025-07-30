






export function ProDashBoardHero(){


    return(<>
    
      <div className="relative bg-[#C1E5EC] p-8 pb-20 rounded-b-3xl mt-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0 w-24 h-24">
            <img
              src="/images/hometownroofing.png"
              alt="Hometown Roofing Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-xl text-[#012C43] flex items-center gap-2">
              Hometown Roofing
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#3CB371]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </h1>
            <p className="text-gray-500 mt-1">Hometown, USA</p>
            <p className="flex items-center space-x-2 text-gray-400 mt-2 font-medium">
              <span>Favorite Pro</span>
              <svg fill="red" stroke="none" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                         2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 
                         2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 
                         5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 
                         21.35z" />
              </svg>
            </p>
          </div>
        </div>
      </div>
    
    
    
    </>);
}