import { useEffect } from 'react';
import ui from '../../../Assctes/vectors/ui.gif';
import web from '../../../Assctes/vectors/web.gif';
import app from '../../../Assctes/vectors/app.gif';
import it_consulting from '../../../Assctes/vectors/IT Consulting.gif';
import custom_software_development from '../../../Assctes/vectors/Custom Software Development.gif';
import data_analytics from '../../../Assctes/vectors/animated Data Analytics.gif';
import DevOps from '../../../Assctes/vectors/DevOps.gif';
import support from '../../../Assctes/vectors/Support And Maintenance.gif';
import e_commerce from '../../../Assctes/vectors/E-commerce.gif';
import erp from '../../../Assctes/vectors/ERP Systems.gif';
import legacy from '../../../Assctes/vectors/Legacy System Modernization.gif';
import crm from '../../../Assctes/vectors/CRM.gif';

import ServiceCart from '../../ServiceCart/ServiceCart';
import Contact from '../../Contact/Contact/Contact';
import moduleName from '../../../Assctes/logo.png';
const ServicePage = () => {

      const serviceInfo = [
            {
                  id: 'ui-ux-design',
                  name: "UI/UX Design",
                  pic: ui,
                  description: "We offer UI/UX design services for software, websites, and dashboards. Our designs are created using Figma, ensuring high-quality and user-friendly interfaces."
            },
            {
                  id: 'web-development',
                  name: "Web Development",
                  pic: web,
                  description: "We offer comprehensive web development services tailored to your needs, from simple static pages to complex dynamic websites."
            },
            {
                  id: 'app-development',
                  name: "App Development",
                  pic: app,
                  description: "We develop legal software for you! Our app development services cover all your needs, ensuring a seamless experience for your users."
            },
            {
                  id: 'custom-software-development',
                  name: "Custom Software Development",
                  pic: custom_software_development,
                  description: "We provide tailored software solutions to meet your specific business needs. Our custom software development services ensure you get exactly what you need."
            },
            {
                  id: 'it-consulting',
                  name: "IT Consulting",
                  pic: it_consulting,
                  description: "Our strategic IT consulting services help you optimize your technology infrastructure and processes. We provide expert advice to ensure your IT strategy aligns with your business goals."
            },

            {
                  id: 'data-analytics',
                  name: "Data Analytics",
                  pic: data_analytics,
                  description: "Our data analytics and business intelligence services provide actionable insights to support your decision-making processes. We help you harness the power of your data."
            },

            {
                  id: 'devops-ci-cd',
                  name: "DevOps and CI/CD",
                  pic: DevOps,
                  description: "We implement and manage DevOps practices to streamline your development and deployment processes. Our continuous integration and continuous deployment (CI/CD) services ensure fast and reliable software delivery."
            },
            {
                  id: 'support-maintenance',
                  name: "Support And Maintenance",
                  pic: support,
                  description: "We provide ongoing technical support and maintenance for your software and systems. Our team ensures your technology operates smoothly and efficiently."
            },
            {
                  id: 'e-commerce-solutions',
                  name: "E-commerce Solutions",
                  pic: e_commerce,
                  description: "We develop and manage e-commerce platforms and solutions tailored to your online business needs. Our services cover everything from product listings to payment processing."
            },
            {
                  id: 'erp-systems',
                  name: "ERP Systems",
                  pic: erp,
                  description: "Our ERP systems integrate and manage your core business processes, including finance, HR, manufacturing, and supply chain. We help you streamline operations and improve efficiency."
            },
            {
                  id: 'legacy-system-modernization',
                  name: "Legacy System Modernization",
                  pic: legacy,
                  description: "We upgrade and modernize your outdated software systems to improve performance and functionality. Our legacy system modernization services ensure your technology remains up-to-date."
            },
            {
                  id: 'crm-solutions',
                  name: "CRM Solutions",
                  pic: crm,
                  description: "We develop and customize CRM systems to manage your customer interactions and data. Our CRM solutions help you build stronger customer relationships."
            },



      ];

   

useEffect(() => {
      window.scrollTo(0, 0);

      document.title =
            "Bright Future Soft | Our Services";

      const description =
            "Bright Future Soft offers ERP systems, CRM solutions, SaaS development, web and mobile app development, UI/UX design, DevOps, IT consulting, and custom software services in Bangladesh.";

      const keywords =
            "Software Development Company Bangladesh, ERP Systems, CRM Solutions, SaaS Development, Web Development, App Development, DevOps Services, IT Consulting, Custom Software Development";

      // Meta Description
      let metaDescription = document.querySelector("meta[name='description']");
      if (!metaDescription) {
            metaDescription = document.createElement("meta");
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);

      // Meta Keywords
      let metaKeywords = document.querySelector("meta[name='keywords']");
      if (!metaKeywords) {
            metaKeywords = document.createElement("meta");
            metaKeywords.name = "keywords";
            document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute("content", keywords);

      // OG Title
      let ogTitle = document.querySelector("meta[property='og:title']");
      if (!ogTitle) {
            ogTitle = document.createElement("meta");
            ogTitle.setAttribute("property", "og:title");
            document.head.appendChild(ogTitle);
      }
      ogTitle.setAttribute("content", "Our Software Development Services");

      // OG Description
      let ogDesc = document.querySelector("meta[property='og:description']");
      if (!ogDesc) {
            ogDesc = document.createElement("meta");
            ogDesc.setAttribute("property", "og:description");
            document.head.appendChild(ogDesc);
      }
      ogDesc.setAttribute("content", description);

      // OG Image (Logo)
      let ogImage = document.querySelector("meta[property='og:image']");
      if (!ogImage) {
            ogImage = document.createElement("meta");
            ogImage.setAttribute("property", "og:image");
            document.head.appendChild(ogImage);
      }
      ogImage.setAttribute("content", moduleName);

      // Canonical
      let canonical = document.querySelector("link[rel='canonical']");
      if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", window.location.href);

}, []);
      return (
            <div className='service-bg py-16'>
                  <div className="px-4 py-20 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-5 md:w-[80%] w-[95%]">
                      
                        <h1 className="text-xl  font-bold relative after:absolute after:left-0 after:right-0 after:bottom-[-18px] after:w-[60px] after:rounded-full after:h-[6px] after:bg-[#0095ff] after:mx-auto text-center text-white">Services We  <span className="shadow-tx">Provide</span></h1>
                        <div className="grid md:grid-cols-3 gap-8 mt-16 p-3 mx-auto">
                              {
                                    serviceInfo.map(data => <ServiceCart key={data.id} data={data} />)
                              }
                        </div>
                  </div>
                  <Contact></Contact>
            </div>
      );
};

export default ServicePage;
