import { Logo } from "./Logo";




export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 px-6 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2">
          <Logo isFooter />
          <span className="text-sm">© 2025 Profer</span>
        </div>
        <div className="space-x-6 text-sm underline flex items-center">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>

        <div className="flex-shrink-0">
          <img
            src="https://static.wixstatic.com/media/8de7f9_25a88ba476834e24a16b06802ff19127~mv2.png/v1/crop/x_0,y_223,w_1654,h_1135/fill/w_650,h_444,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/profer_projects_edited.png"
            alt="Illustration showing two characters working with a ladder and tools on a modern styled background in blue and red tones"
            className="h-24 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </footer>
  );
}
