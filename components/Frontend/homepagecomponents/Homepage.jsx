




import {ProfessionalProfile} from "../../../components/Frontend/homepagecomponents/ProfilePage";
import {Protwo} from "../../../components/Frontend/homepagecomponents/Partwo";
import {Parthree} from "../../../components/Frontend/homepagecomponents/Parthree";
import {Partfour} from "../../../components/Frontend/homepagecomponents/Partfour";
import {Partfive} from "../../../components/Frontend/homepagecomponents/Partfive";
import {Partsix} from "../../../components/Frontend/homepagecomponents/Partsix";
import {Partseven} from "../../../components/Frontend/homepagecomponents/Partseven";
import {Parteight} from "../../../components/Frontend/homepagecomponents/Parteight";
import {HomeHero} from "../../../components/Frontend/homepagecomponents/Homepagehero";

export default function Home() {
  return (
  <>
 

  <main className="font-sans">


     <HomeHero></HomeHero>
      
      <ProfessionalProfile />
      <Protwo/>
      <Parthree/>
      <Partfour/>
      <Partfive/>
      <Partsix/>
      <Partseven/>
       <Parteight/>
    </main>
  </>


  );
}