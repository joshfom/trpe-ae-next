import Image from "next/image";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Globe, Phone} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Golf Point by Emaar in Dubai South",
    description: "Golf Point by Emaar in Dubai South is a luxury apartment project designed to offer unmatched elegance and tranquility, especially for those seeking an upscale golf lifestyle.",
};


export default function GolfPointLandingPage() {
  return (
      <div className="bg-black text-white">
          <header className={'max-w-7xl mx-auto'}>
              <nav
                  className="flex flex-col lg:flex-row items-center gap-6 justify-between w-full py-4 shadow-lg px-6 lg:px-12 mx-auto">
                  <a href={'/'} className={'text-3xl font-semibold'}>
                      Golf Point <span className={''}>by EMAAR</span>
                  </a>

                  <div className="flex items-center space-x-6">
                      <a href={'tel:+971 50 523 2712'} className={'flex space-x-2'}>
                          <Phone size={22} className={'stroke-1'}/>
                          <span className={'hover:underline font-semibold'}>+971 50 523 2712</span>
                      </a>

                      <a href={'https://wa.me/971505232712?text=I%20am%20interested%20to%20know%20more%20about%20Damac%20Island%20project'}
                         className={'flex items-center space-x-2'}>
                          <svg className={'w-7 h-7'} xmlns="http://www.w3.org/2000/svg" fill="#fff" stroke="#fff"
                               viewBox="0 0 256 256">
                              <path
                                  d="M128 28a100.026 100.026 0 0 0-86.885 149.54l-9.005 31.516a12 12 0 0 0 14.835 14.834l31.517-9.004A100.007 100.007 0 1 0 128 28Zm0 192a91.87 91.87 0 0 1-46.952-12.867 3.995 3.995 0 0 0-3.144-.408l-33.157 9.473a4 4 0 0 1-4.944-4.945l9.472-33.156a4.001 4.001 0 0 0-.408-3.144A92.01 92.01 0 1 1 128 220Zm50.512-73.457-20.46-11.691a12.01 12.01 0 0 0-12.127.129l-13.807 8.284a44.042 44.042 0 0 1-19.382-19.383l8.284-13.807a12.01 12.01 0 0 0 .128-12.127l-11.69-20.46A10.916 10.916 0 0 0 100 72a32.008 32.008 0 0 0-32 31.88A84.001 84.001 0 0 0 151.999 188h.12A32.008 32.008 0 0 0 184 156a10.913 10.913 0 0 0-5.488-9.457ZM152.108 180H152a76 76 0 0 1-76-76.107A23.997 23.997 0 0 1 100 80a2.9 2.9 0 0 1 2.512 1.457l11.69 20.461a4.004 4.004 0 0 1-.042 4.042l-9.39 15.648a3.999 3.999 0 0 0-.218 3.699 52.041 52.041 0 0 0 26.142 26.141 3.997 3.997 0 0 0 3.699-.218l15.647-9.39a4.006 4.006 0 0 1 4.043-.043l20.46 11.692A2.897 2.897 0 0 1 176 156a23.997 23.997 0 0 1-23.892 24Z"/>
                          </svg>
                      </a>

                  </div>
              </nav>
          </header>
          <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
              <div className={'w-full py-6'}>
                  <div
                      className="h-[600px] lg:h-[700px] max-w-7xl flex items-center mx-auto rounded-3xl overflow-hidden">
                      <img
                          src="/assets/golf-point-lunch-hero.webp"
                          className={'h-[600px] lg:h-[700px] w-full object-cover'} alt=""/>
                  </div>
              </div>


              {/* Overview Section */}
              <section className="max-w-7xl mx-auto py-12 px-4">
                  <div className="md:flex md:items-center md:justify-between">
                      <div className="md:w-1/2 pr-6">
                          <h2 className="text-3xl font-semibold">Dubai South: The Future of Dubai</h2>
                          <p className="mt-4 text-gray-200">Part of the Dubai 2040 Urban Master Plan, Dubai South is set
                              to become a central hub, contributing 35% of Dubai&apos;s GDP and creating over 500,000 jobs,
                              with an expected population of 1.5 million. Located perfectly with excellent connectivity
                              via Emirates Road, Sheikh Mohammed Bin Zayed Road, and the upcoming Etihad Rail.</p>
                      </div>
                      <div className="md:w-1/2 mt-8 md:mt-0">
                          <img src="/assets/dubai-south.webp" alt="Dubai South Overview"
                               className="rounded-lg w-full h-full object-cover"/>
                      </div>
                  </div>
              </section>
              <div
                  className="px-6 lg:px-0 max-w-7xl mx-auto flex items-center py-8 justify-between flex-col sm:flex-row gap-8">
                  <div className="w-full lg:w-1/2">
                      <div
                          className="h-[400px] lg:h-[500px] max-w-7xl flex items-center mx-auto rounded-3xl overflow-hidden">
                          <img src="/assets/golf-point-overview.webp"
                               className={'h-[400px] lg:h-[500px] w-full object-cover'} alt=""/>
                      </div>
                  </div>
                  <div className="w-full lg:w-1/2 lg:pl-4">
                      <h2 className="text-2xl font-semibold">
                          About Golf Point
                      </h2>
                      <p className="pt-2">
                          Golf Point is an exclusive, luxury apartment project in Dubai South designed to offer
                          unmatched elegance and tranquility, especially for those seeking an upscale golf lifestyle.
                          Golf Point promises an extraordinary residential experience with high-quality amenities,
                          modern interiors, and access to world-class recreational facilities.
                      </p>
                      <div className={'pt-3'}>
                          <p className="font-semibold pb-2">Key Investment Highlights:
                          </p>
                          <ul className={'pl-3 list-disc space-y-2'}>
                              <li>
                                  <span className="font-semibold">Premier Location:</span> Nestled alongside the 9th
                                  hole of an 18-hole championship golf course, residents enjoy unrivaled views and a
                                  serene environment.
                              </li>

                              <li>
                                  <span className="font-semibold">Luxurious Amenities:</span> A sprawling 9,520 sqm
                                  amenities podium includes an infinity pool with golf views, a stylish multipurpose
                                  room, and beautifully designed, contemporary interiors that marry style with
                                  functionality.
                              </li>
                              <li>
                                  <span className="font-semibold">Exclusive Apartment Types: </span>
                                  Choose from thoughtfully designed 1-, 2-, and 3-bedroom units, each with fully fitted
                                  kitchens and spacious layouts, catering to both single investors and families.
                              </li>
                              <li>
                                  <span className="font-semibold">High Investment Potential:  </span>
                                  With Dubai South emerging as a key growth hub, Golf Point offers excellent long-term
                                  value appreciation potential, especially for those targeting the high-demand luxury
                                  rental market.
                              </li>
                          </ul>
                          <p className="py-3">
                              Whether as a home or a valuable investment asset, Golf Point is a premier choice for those
                              looking to be part of Dubai’s luxury real estate scene while enjoying the tranquility and
                              exclusivity of a golf-centered lifestyle.
                          </p>
                      </div>
                  </div>

              </div>

              <div className="py-6 max-w-7xl mx-auto ">
                  <h3 className="text-2xl font-semibold">Gallery</h3>
              </div>

              <div
                  className="px-6 lg:px-0 max-w-7xl mx-auto flex items-center py-6 justify-between flex-col sm:flex-row gap-12">


                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="h-[300px] rounded-lg overflow-hidden">
                          <img src="/assets/golf-point-gallery-1.webp" className="w-full h-full object-cover"
                               alt="Golf Point Gallery 1"/>
                      </div>
                      <div className="h-[300px] rounded-lg overflow-hidden">
                          <img src="/assets/golf-point-gallery-2.webp" className="w-full h-full object-cover"
                               alt="Golf Point Gallery 2"/>
                      </div>
                      <div className="h-[300px] rounded-lg overflow-hidden">
                          <img src="/assets/golf-point-gallery-3.webp" className="w-full h-full object-cover"
                               alt="Golf Point Gallery 3"/>
                      </div>
                  </div>

              </div>
              <div className={'pt-6 mx-auto max-w-4xl'}>
                  <Dialog>
                      <DialogTrigger
                          className={'rounded-3xl border border-white bg-transparent py-2.5 px-6 hover:bg-white hover:text-black'}>Request
                          media</DialogTrigger>
                      <DialogContent className={'max-w-2xl bg-black'}>
                          <DialogHeader>
                              <DialogTitle className={'text-2xl text-center'}>Get more media</DialogTitle>


                          </DialogHeader>

                          <div className="py-6">
                              <ContactForm
                                  requestType={'Request media'}
                              />
                          </div>
                      </DialogContent>
                  </Dialog>
              </div>


              <div className="py-12 max-w-7xl px-6 lg:px-0 mx-auto">
                  <div className="flex items-center flex-col justify-center">
                      <h2 className={'text-3xl'}>Floor Plans</h2>

                      <div className="max-w-5xl mx-auto text-center pt-6">
                          Golf Point offers thoughtfully designed floor plans that cater to a range of lifestyles and
                          preferences, ensuring residents enjoy both space and sophistication. The 1-, 2-, and 3-bedroom
                          apartments are generously sized, with average layouts of 687, 1,055, and 1,805 square feet,
                          respectively. Each unit features fully fitted kitchens, modern finishes, and open-concept
                          living areas that maximize natural light and enhance the panoramic views of the golf course.
                          The floor plans are crafted to balance luxury and functionality, providing ample space for
                          relaxation, entertaining, and everyday living. With options ranging from cozy one-bedroom
                          retreats to expansive three-bedroom homes, Golf Point meets the diverse needs of single
                          professionals, couples, and families alike, making it an ideal choice for discerning investors
                          and homeowners.
                      </div>

                      <div className={'pt-6'}>
                          <Dialog>
                              <DialogTrigger
                                  className={'rounded-3xl border border-white bg-transparent py-2.5 px-6 hover:bg-white hover:text-black'}>Get
                                  Floor Plan</DialogTrigger>
                              <DialogContent className={'max-w-2xl bg-black'}>
                                  <DialogHeader>
                                      <DialogTitle className={'text-2xl text-center'}>Get floor plans</DialogTitle>


                                  </DialogHeader>

                                  <div className="py-6">
                                      <ContactForm
                                          requestType={'Download Floor Plan'}
                                      />
                                  </div>
                              </DialogContent>
                          </Dialog>
                      </div>

                  </div>
              </div>


          </main>
          <div className="px-6 lg:px-0 max-w-7xl mx-auto flex flex-col items-center py-12">
              <h3 className="text-3xl">
                  Request a Call Back
              </h3>

              <div className="max-w-4xl mx-auto pt-6">
                  <ContactForm/>
              </div>

          </div>

          <footer className="row-start-3 flex gap-6 pt-12 flex-wrap items-center justify-center">

              <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://trpe.ae"
                 target="_blank" rel="noopener noreferrer">
                  <Globe size={22} className={'stroke-1'}/>
                  Powered by TRPE Real Estate
              </a>
          </footer>
      </div>
  );
}
