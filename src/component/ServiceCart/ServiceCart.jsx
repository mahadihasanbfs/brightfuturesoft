import React from "react";
import { HiArrowSmallRight } from "react-icons/hi2";
import { Link } from "react-router-dom";

const ServiceCart = ({ data }) => {
      const { id, pic, name, description, category } = data;

      // Ensure the card displays a concise 1-2 sentence teaser instead of full description
      const getShortDesc = (text) => {
            if (!text) return "";
            const firstPeriod = text.indexOf('.');
            if (firstPeriod > 20 && firstPeriod <= 110) {
                  return text.slice(0, firstPeriod + 1);
            }
            if (text.length > 105) {
                  return text.slice(0, 100).trim() + "...";
            }
            return text;
      };

      const shortDescription = getShortDesc(description);

      return (
            <Link
                  to={`/service/${id}`}
                  className="service-grid-card group"
                  aria-label={`Explore ${name} services`}
            >
                  <article className="flex h-full flex-col">
                        <div className="service-card-media">
                              <img
                                    loading="lazy"
                                    src={pic}
                                    alt={`${name} software engineering services by Bright Future Soft`}
                              />
                        </div>
                        <div className="service-card-body">
                              <span className="service-card-tag">
                                    {category || "Enterprise Service"}
                              </span>
                              <h3 className="service-card-title">{name}</h3>
                              <p className="service-card-desc" title={description}>
                                    {shortDescription}
                              </p>

                              <div className="service-card-action">
                                    <span>Learn more</span>
                                    <HiArrowSmallRight aria-hidden="true" />
                              </div>
                        </div>
                  </article>
            </Link>
      );
};

export default ServiceCart;


