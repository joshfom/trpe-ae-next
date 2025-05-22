import Image from "next/image";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Globe, Phone} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "DAMAC Islands",
    description: "Damac Islands by Damac Properties in Dubai",
};


export default function DamaIslandLandingPage() {
  return (
      <div className="bg-black text-white">
          <header className={'max-w-7xl mx-auto'}>
              <nav
                  className="flex flex-col lg:flex-row items-center gap-6 justify-between w-full py-4 shadow-lg px-6 lg:px-12 mx-auto">
                  <a href={'/'} className={'text-3xl font-semibold'}>
                      DAMAC ISLAND
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
                          src="/assets/damac-island-hero-image.webp"
                          className={'h-[600px] lg:h-[700px] w-full object-cover'} alt=""/>
                  </div>
              </div>

              <div
                  className="px-6 lg:px-0 max-w-7xl mx-auto flex items-center py-12 justify-between flex-col sm:flex-row gap-8">
                  <div className="w-full lg:w-1/2">
                      <h2 className="text-2xl font-semibold">
                          Overview
                      </h2>
                      <p className="pt-2">
                          Damac Islands is an exciting new master-planned community from the renowned Damac Properties,
                          offering a stunning collection of luxury residences in Dubai. This fresh development
                          reimagines upscale living by combining natural beauty with modern comfort. Located next to the
                          prestigious Sun City community, Damac Islands promises a water-focused lifestyle that feels
                          like an escape to a coastal paradise. With its pristine sandy beaches, crystal-clear lagoons,
                          and immersive waterfront experiences, this development is more than just a place to live—it’s
                          a destination in its own right.
                      </p>
                  </div>
                  <div className="w-full lg:w-1/2">
                      <div
                          className="h-[400px] lg:h-[500px] max-w-7xl flex items-center mx-auto rounded-3xl overflow-hidden">
                          <img src="/assets/damac-island-community.webp"
                               className={'h-[400px] lg:h-[500px] w-full object-cover'} alt=""/>
                      </div>
                  </div>
              </div>

              <div
                  className="px-6 lg:px-0 max-w-7xl mx-auto flex items-center py-6 justify-between flex-col sm:flex-row gap-12">
                  <div className="w-full lg:w-1/2">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead className="">Bedrooms</TableHead>
                                  <TableHead className="">Starting Size</TableHead>
                                  <TableHead>Starting Price</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              <TableRow>
                                  <TableCell className="">4 BHK</TableCell>
                                  <TableCell>2,282 SQ. FT</TableCell>
                                  <TableCell>2.98 MILLION AED</TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="">5 BHK</TableCell>
                                  <TableCell>3,388 SQ. FT</TableCell>
                                  <TableCell>4.43 MILLION AED</TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="">6 BHK</TableCell>
                                  <TableCell>11,000 SQ. FT</TableCell>
                                  <TableCell>15 MILLION AED</TableCell>
                              </TableRow>
                              <TableRow>
                                  <TableCell className="">7 BHK</TableCell>
                                  <TableCell>17,591 SQ. FT</TableCell>
                                  <TableCell>24 MILLION AED</TableCell>
                              </TableRow>
                          </TableBody>
                      </Table>

                      <div className="py-6 flex justify-end">
                          <Dialog>
                              <DialogTrigger
                                  className={'rounded-3xl border border-white bg-transparent py-2.5 px-6 hover:bg-white hover:text-black'}>Download
                                  Payment Plan</DialogTrigger>
                              <DialogContent className={'max-w-2xl bg-black'}>
                                  <DialogHeader>
                                      <DialogTitle>Download Payment Plan</DialogTitle>
                                  </DialogHeader>

                                  <div className="py-6">
                                      <ContactForm
                                          requestType={'Download Payment Plan'}
                                      />
                                  </div>
                              </DialogContent>
                          </Dialog>

                      </div>

                  </div>
                  <div className="w-full lg:w-1/2">
                      <h2 className="text-2xl font-semibold">
                          World Class Waterside Amenities
                      </h2>
                      <p className="pt-2">
                          The outstanding DAMAC Islands Villa and DAMAC Islands Townhouse offer a plethora of amenities
                          and benefits to its residents. Residents seeking the utmost luxury and sophistication can
                          surely think of investing in this premium location. Here are some of the top-of-the-line
                          amenities that cater to the resident’s everyday needs and interests.
                      </p>
                  </div>
              </div>


              <div
                  className="px-6 lg:px-0 max-w-7xl mx-auto flex items-center py-6 justify-between flex-col sm:flex-row gap-12">
                  <div className="w-full lg:w-1/2">
                      <h2 className="text-2xl font-semibold">
                          World Class Waterside Amenities
                      </h2>
                      <p className="pt-2">
                          The outstanding DAMAC Islands Villa and DAMAC Islands Townhouse offer a plethora of amenities
                          and
                          benefits to its residents. Residents seeking the utmost luxury and sophistication can surely
                          think
                          of investing in this premium location. Here are some of the top-of-the-line amenities that
                          cater
                          to the resident’s everyday needs and interests.
                      </p>
                  </div>


                  <div className="w-full lg:w-1/2">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                              <h3 className=" font-semibold">Beach Access</h3>
                              <p className="pt-2 text-sm">
                                  Residents can enjoy direct access to the pristine sandy beaches of Damac Islands.
                              </p>
                          </div>

                          <div>
                              <h3 className=" font-semibold">Waterfront Living</h3>
                              <p className="pt-2 text-sm">
                                  The development offers a range of waterfront residences with stunning views.
                              </p>
                          </div>

                          <div>
                              <h3 className=" font-semibold">Lush Green Spaces</h3>
                              <p className="pt-2 text-sm">
                                  The community features beautifully landscaped gardens and parks.
                              </p>
                          </div>


                          <div>
                              <h3 className=" font-semibold">Cycling</h3>
                              <p className="pt-2 text-sm">
                                  Residents can enjoy cycling on the dedicated cycling tracks.
                              </p>
                          </div>

                          <div>
                              <h3 className=" font-semibold">Infinity Pool</h3>
                              <p className="pt-2 text-sm">
                                  The development features a stunning infinity pool with panoramic views.
                              </p>
                          </div>

                          <div>
                              <h3 className=" font-semibold">Fitness Center</h3>
                              <p className="pt-2 text-sm">
                                  Residents can stay fit and healthy at the state-of-the-art fitness center.
                              </p>
                          </div>


                          <div>
                              <h3 className=" font-semibold">Marina and Yacht Club</h3>
                              <p className="pt-2 text-sm">
                                  The development features a marina and yacht club for residents to enjoy
                                  water-based activities.
                              </p>
                          </div>

                      </div>

                  </div>

              </div>

              <div className="py-12 max-w-7xl px-6 lg:px-0 mx-auto">
                  <div className="flex items-center flex-col justify-center">
                      <h2 className={'text-3xl'}>Floor Plans</h2>

                      <div className="max-w-5xl mx-auto text-center pt-6">
                          The floor plans at Damac Islands feature a diverse selection of thoughtfully designed villas
                          and townhouses, ranging from 3 to 6 bedrooms. Each unit offers spacious, modern living spaces
                          that perfectly blend luxury and functionality. The homes boast large living and dining areas
                          ideal for family gatherings and entertaining, open-plan kitchens with sleek, modern fixtures,
                          and generously sized bedrooms complete with built-in wardrobes and en-suite bathrooms for
                          added privacy and comfort. Expansive balconies, terraces, and private gardens provide ample
                          space to enjoy the beautiful surroundings, while dedicated parking ensures convenience and
                          security. The contemporary architecture incorporates natural color palettes, creating an
                          inviting and harmonious atmosphere throughout, with each floor plan designed to maximize space
                          while maintaining an elegant, sophisticated feel.
                      </div>

                      <div className={'pt-6'}>
                          <Dialog>
                              <DialogTrigger
                                  className={'rounded-3xl border border-white bg-transparent py-2.5 px-6 hover:bg-white hover:text-black'}>Download
                                  Payment Plan</DialogTrigger>
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
