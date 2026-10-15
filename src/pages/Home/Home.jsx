import React from 'react';
import HeadSection from '../../component/HeadSection/HeadSection/HeadSection';
import OurRequrement from '../../component/OurRequrement/OureRequrement/OurRequrement';
import Service from '../../component/Service/Service/Service';
import Project from '../../component/Project/Project/Project';
import Testimonial from '../../component/Testimonials/Testimonials/Testimonials';
import Technology from '../../component/Technology/Techonology/Technology';
import Contact from '../../component/Contact/Contact/Contact';
import Team from '../../component/Team/Team/Team';

import { useEffect } from 'react';
import OurClients from '../../component/Clients/OurClients';

const Home = () => {
   useEffect(() => {
      window.scrollTo(0, 0);

      document.title =
            "Bright Future Soft | Best Software Company in Bangladesh | Web, Mobile, ERP, CRM, AI & IT Solutions";

      const description =
            "Bright Future Soft is Bangladesh’s leading software company delivering web & mobile apps, ERP, CRM, AI-powered solutions, e-commerce platforms, cloud services, and custom business software.";

      const keywords =
            "Software Company in Bangladesh, ERP Software, CRM Software, SaaS Solutions, Web Development, Mobile App Development, AI Software, E-commerce Development, Cloud Services, IT Consulting, Custom Software Development";

      // Description
      const metaDescription = document.querySelector("meta[name='description']");
      if (metaDescription) {
            metaDescription.setAttribute("content", description);
      } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = description;
            document.head.appendChild(meta);
      }

      // Keywords
      const metaKeywords = document.querySelector("meta[name='keywords']");
      if (metaKeywords) {
            metaKeywords.setAttribute("content", keywords);
      } else {
            const meta = document.createElement("meta");
            meta.name = "keywords";
            meta.content = keywords;
            document.head.appendChild(meta);
      }

      // OG Title
      const ogTitle = document.querySelector("meta[property='og:title']");
      if (ogTitle) {
            ogTitle.setAttribute("content", "Bright Future Soft");
      } else {
            const meta = document.createElement("meta");
            meta.setAttribute("property", "og:title");
            meta.content = "Bright Future Soft";
            document.head.appendChild(meta);
      }

      // OG Description
      const ogDesc = document.querySelector("meta[property='og:description']");
      if (ogDesc) {
            ogDesc.setAttribute("content", description);
      } else {
            const meta = document.createElement("meta");
            meta.setAttribute("property", "og:description");
            meta.content = description;
            document.head.appendChild(meta);
      }

      // Canonical
      const canonicalUrl = window.location.origin;
      let link = document.querySelector("link[rel='canonical']");
      if (link) {
            link.setAttribute("href", canonicalUrl);
      } else {
            link = document.createElement("link");
            link.setAttribute("rel", "canonical");
            link.setAttribute("href", canonicalUrl);
            document.head.appendChild(link);
      }

}, []);

      return (
            <div className="relative">
                  <HeadSection />
                  <OurClients />
                  <OurRequrement />
                  <Service />
                  <Project />
                  <Technology />
                  <Team />
                  <Testimonial />
                  <Contact />
            </div>
      );
};

export default Home;
