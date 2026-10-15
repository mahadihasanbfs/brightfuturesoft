import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Briefcase, Users } from 'lucide-react';

const JobCard = ({ data }) => {
      if (!data) return null;

      const isDeadlinePassed = data.dateline 
            ? new Date(data.dateline + "T23:59:59") < new Date()
            : false;

      const formattedDeadline = data.dateline
            ? new Date(data.dateline).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
              })
            : null;

      return (
            <Link 
                  to={`/careers/${data._id}`} 
                  className="career-job-card group block"
                  aria-label={`View opening for ${data.job_position}`}
            >
                  <div className="career-job-main">
                        <div className="career-job-badges">
                              {data.job_type && (
                                    <span className="career-badge primary">
                                          <Briefcase className="w-3 h-3 inline mr-1" />
                                          {data.job_type}
                                    </span>
                              )}
                              {data.workplace && (
                                    <span className="career-badge neutral">
                                          {data.workplace}
                                    </span>
                              )}
                              {data.vacancy && (
                                    <span className="career-badge success">
                                          <Users className="w-3 h-3 inline mr-1" />
                                          {data.vacancy} {Number(data.vacancy) === 1 ? 'Opening' : 'Openings'}
                                    </span>
                              )}
                              {isDeadlinePassed && (
                                    <span className="career-badge neutral bg-amber-50 text-amber-700 border-amber-200">
                                          Closed
                                    </span>
                              )}
                        </div>

                        <h3 className="career-job-title group-hover:text-[#0a65b4]">
                              {data.job_position}
                        </h3>

                        <div className="career-job-meta-row">
                              <span className="career-job-meta-item">
                                    <MapPin className="w-3.5 h-3.5 text-[#0a65b4]" />
                                    <span>{data.location || 'Dhaka, Bangladesh (Remote-first)'}</span>
                              </span>
                              {formattedDeadline && (
                                    <span className="career-job-meta-item">
                                          <Calendar className="w-3.5 h-3.5 text-[#0a65b4]" />
                                          <span>Deadline: {formattedDeadline}</span>
                                    </span>
                              )}
                        </div>
                  </div>

                  <div className="career-job-action">
                        <span className="career-apply-btn">
                              <span>View Role & Apply</span>
                              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                  </div>
            </Link>
      );
};

export default JobCard;

