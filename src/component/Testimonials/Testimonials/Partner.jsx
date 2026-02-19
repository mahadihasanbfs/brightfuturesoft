const Partner = () => {
      return (
            <div>
                  <section className="py-12  sm:py-16 lg:py-20 xl:py-24">
                        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                              <div className="text-center bg-gray-900 rounded-2xl">
                                    <div className="px-6 py-12 md:py-16 lg:p-20">
                                          <h1 className="text-xl  font-bold relative after:absolute after:left-0 after:right-0 after:bottom-[-18px] after:w-[60px] after:rounded-full after:h-[6px] after:bg-[#0095ff] after:mx-auto text-center text-white">Our<span className="shadow-tx"> Partner</span></h1>
                                          <div className="flex flex-wrap items-center justify-center max-w-5xl gap-8 mx-auto mt-12 sm:mt-16 sm:gap-y-12 md:gap-16">
                                                <a href="https://www.goodfirms.co/company/bright-future-soft" target="_blank" rel="noopener noreferrer">
                                                      <img
                                                            // need this image original color gold and white
                                                            // style={{
                                                            //       filter: "brightness(0) invert(1)",
                                                            // }}
                                                            // style={{
                                                            //       filter: "brightness(0) invert(1)",
                                                            // }}

                                                            className="object-contain  w-32 max-w-full sm:h-8 md:h-10 sm:w-44"
                                                            src="https://www.sidekickinteractive.com/wp-content/uploads/2025/10/Goodfirms-Logo-Vector.svg-1-2-300x45.png"
                                                            alt=""
                                                      />
                                                </a>
                                                <img
                                                      className="object-contain w-32 max-w-full h-8 md:h-10 lg:h-12 sm:w-44"
                                                      src="https://img.icons8.com/?size=100&id=wU62u24brJ44&format=png&color=000000"
                                                      alt=""
                                                />
                                                <img
                                                      className="object-contain w-32 max-w-full h-8 md:h-10 lg:h-12 sm:w-44"
                                                      src="https://upload.wikimedia.org/wikipedia/commons/7/79/DigitalOcean_logo.png"
                                                      alt=""
                                                />
                                                <img
                                                      className="object-contain w-32 max-w-full h-8 md:h-10 lg:h-12 sm:w-44"
                                                      src="https://www.itfirms.co/wp-content/themes/lawyeria-lite/images/itfirms-footer.png"
                                                      alt=""
                                                />

                                          </div>
                                    </div>
                              </div>
                        </div>
                  </section>

            </div>
      );
};

export default Partner;
