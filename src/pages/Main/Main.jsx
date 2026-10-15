import { Outlet } from "react-router-dom";
import Footer from "../shared/Footer/Footer";
import Header from "../shared/Header/Header";
import CopyrightBar from "../shared/CopyrightBar/CopyrightBar";
import WhatsAppChat from "../shared/WhatsAppChat/WhatsAppChat";

const Main = () => {
      return (
            <div className="public-site">
                  <WhatsAppChat />
                  <div>
                        <Header />
                  </div>
                  <div className="pt-6"><Outlet /></div>
                  <Footer />
                  <CopyrightBar />
            </div>
      );
};

export default Main;
