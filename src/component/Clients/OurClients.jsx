import aiCarrierExpert from "../../Assctes/Company/aiexpertcareer_logo.jpeg";
import doob from "../../Assctes/Company/doob.png";
import fcWin4 from "../../Assctes/Company/fcwin4.png";
import hikmah from "../../Assctes/Company/hikmahlogo.png";
import onyx from "../../Assctes/Company/onyx-hospitality.png";
import seaProperty from "../../Assctes/Company/sealogo.png";

const clients = [
  { name: "Doob", logo: doob },
  { name: "Hikmah Holdings", logo: hikmah },
  { name: "Sea Property", logo: seaProperty },
  { name: "AI Carrier Expert", logo: aiCarrierExpert },
  { name: "FC Win 4", logo: fcWin4 },
  { name: "ONYX Hospitality", logo: onyx },
];

const OurClients = () => (
  <section aria-labelledby="our-clients-heading" className="client-section px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="client-intro">
        <div><span className="site-eyebrow">Teams we work with</span>
        <h2 id="our-clients-heading">Built on trust.<br /><span>Made to move business forward.</span></h2></div>
        <p>We partner with ambitious organizations to turn complex ideas into useful, dependable digital products.</p>
      </div>
      <div className="client-grid">
        {clients.map(({ name, logo }) => (
          <div key={name} className="client-logo-card">
            <img src={logo} alt={name} loading="lazy" />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default OurClients;
