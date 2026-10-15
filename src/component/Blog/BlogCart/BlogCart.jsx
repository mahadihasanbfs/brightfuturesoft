import { HiArrowSmallRight, HiClock } from "react-icons/hi2";
import { Link } from "react-router-dom";

const BlogCart = ({ bData }) => {
      const { title, img, message, meta_tag, meta_description, url, date } = bData;

      // Calculate estimated reading time
      const textToCount = (meta_description || message || "").replace(/<[^>]*>/g, '');
      const wordCount = textToCount.split(/\s+/).filter(Boolean).length;
      const readingMinutes = Math.max(2, Math.ceil(wordCount / 180));

      // Extract category tag
      const category = meta_tag && meta_tag.length > 0 
            ? (meta_tag.includes(",") ? meta_tag.split(",")[0].trim() : meta_tag.trim()) 
            : "Engineering";

      // Formatted publication date
      const displayDate = date ? new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
      }) : "Recently Published";

      // Clean plain-text excerpt
      const cleanExcerpt = meta_description 
            ? meta_description.replace(/<[^>]*>/g, '').slice(0, 140)
            : (message ? message.replace(/<[^>]*>/g, '').slice(0, 140) : "");

      return (
            <Link
                  to={`/blog/${url}`}
                  className="blog-grid-card group"
                  aria-label={`Read article: ${title}`}
            >
                  <article className="flex h-full flex-col">
                        <div className="blog-card-media">
                              <img
                                    loading="lazy"
                                    src={img}
                                    alt={`${title} - Bright Future Soft Engineering Blog`}
                                    onError={(e) => {
                                          e.target.src = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60";
                                    }}
                              />
                        </div>
                        <div className="blog-card-body">
                              <div className="blog-card-meta-row">
                                    <span className="blog-card-tag">{category}</span>
                                    <span className="blog-card-reading-time inline-flex items-center gap-1 whitespace-nowrap shrink-0">
  <HiClock aria-hidden="true" />
  <span>{readingMinutes} min read</span>
</span>
                              </div>

                              <h3 className="blog-card-title">{title}</h3>
                              <p className="blog-card-desc">{cleanExcerpt}</p>

                              <div className="blog-card-footer">
                                    <span className="blog-card-date">{displayDate}</span>
                                    <div className="blog-card-action">
                                          <span>Read Article</span>
                                          <HiArrowSmallRight aria-hidden="true" />
                                    </div>
                              </div>
                        </div>
                  </article>
            </Link>
      );
};

export default BlogCart;
