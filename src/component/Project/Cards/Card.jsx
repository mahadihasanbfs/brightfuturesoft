import React from "react";
import { Link } from "react-router-dom";

const Card = ({ data }) => {
  const description = typeof window === 'undefined' ? '' : new DOMParser().parseFromString(data?.description || '', 'text/html').body.textContent || '';
  return (
    <Link to={`/project/${data?.url}`} className="project-card group">
      <div className="project-card-image" style={{ backgroundImage: `url(${data?.image_url})` }} role="img" aria-label={data?.project_name || 'Project preview'} />
      <div className="project-card-copy">
        <span className="project-card-label">Featured project</span>
        <h3>{data?.project_name}</h3>
        <p>{description.slice(0, 110)}{description.length > 110 ? '…' : ''}</p>
        <span className="project-card-link">View project <span aria-hidden="true">↗</span></span>
      </div>
    </Link>
  );
};

export default Card;
