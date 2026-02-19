import React from 'react';
import { useLoaderData } from 'react-router-dom';

const Notice_View = () => {

      const notice_data = useLoaderData()
      const notice = notice_data.data

      return (
            <div>
                  <section class="py-12  sm:py-16 lg:py-20 ">
                        <div class="px-4  sm:px-6 lg:px-8 max-w-7xl">
                              <div class=" ">
                                    <div class="">
                                          <h1 class="text-4xl font-bold text-gray-100 sm:text-4xl">{notice?.subject}</h1>
                                          <p class="mt-6 text-2xl  font-medium text-gray-300">{new Date(notice?.notice_date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>

                                    <div class="mt-12 sm:mt-16">

                                          <article
                                                dangerouslySetInnerHTML={{
                                                      __html: notice.body,
                                                }}
                                                class="mt-12 prose lg:mt-0 lg:prose-lg lg:col-span-8 prose-blockquote:lg:text-xl prose-blockquote:lg:leading-9 prose-blockquote:not-italic prose-blockquote:border-none prose-blockquote:text-lg prose-blockquote:leading-8 prose-blockquote:p-0 prose-blockquote:lg:p-0 prose-blockquote:font-medium prose-blockquote:text-gray-900"
                                          >

                                          </article>
                                    </div>
                              </div>
                        </div>
                  </section>

            </div>
      );
};

export default Notice_View;
