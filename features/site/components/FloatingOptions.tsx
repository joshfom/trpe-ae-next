"use client"
import React, { memo, useCallback } from 'react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

function FloatingOptions() {
    const [sizeType, setSizeType] = React.useState('sqf')

    // Memoized callback functions
    const handleSetSqf = useCallback(() => {
        setSizeType('sqf');
    }, []);

    const handleSetSqm = useCallback(() => {
        setSizeType('sqm');
    }, []);


    return (
        <div className={'hidden xl:block'}>
            <div className="fixed right-5 lg:right-10 z-30 top-1/2 bottom-1/2 p-4">
                <div className="h-full flex justify-center items-center">
                    <div className={'fixed rounded-l-2xl border border-white py-2 bg-black'}>
                        <Accordion type="single" collapsible>
                            <AccordionItem className={'pr-4'} value="dubai">
                                <AccordionTrigger
                                    className={'flex py-1 pb-2 items-center  px-4 space-x-2 text-white text-xs pr-6'}>
                                       <span>

                                       </span> Dubai
                                </AccordionTrigger>
                                <AccordionContent className={'flex pl-4 text-xs text-white'}>
                                    <a className={'inline-flex py-2'} href="https://trpe.co.uk" target="_blank">
                                          <span className="mr-1">
<svg className={'w-4 h-4 mr-2'} xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 473.68 473.68">
  <path
      d="M41.712 102.641c-15.273 22.168-26.88 47.059-33.918 73.812h107.734l-73.816-73.812zM170.511 9.48a235.987 235.987 0 0 0-74.814 37.168l74.814 74.814V9.48zM101.261 430.982a235.633 235.633 0 0 0 69.25 33.211v-102.45l-69.25 69.239zM10.512 306.771c7.831 25.366 19.831 48.899 35.167 69.833l69.833-69.833h-105z"
      style={{fill: "#29337a"}}/>
  <path
      d="M45.619 97.144a241.902 241.902 0 0 0-3.908 5.501l73.816 73.812H7.793c-1.746 6.645-3.171 13.418-4.345 20.284h141.776L45.619 97.144zM95.767 427.074c1.802 1.343 3.654 2.621 5.493 3.908l69.25-69.242v102.45c6.653 1.945 13.41 3.624 20.284 4.974V332.05l-95.027 95.024zM5.25 286.487c1.47 6.873 3.205 13.642 5.258 20.284h105.001l-69.833 69.833a238.435 238.435 0 0 0 25.168 29.12L190.08 286.487H5.25zM170.511 9.48v111.982l-74.815-74.81c-10.314 7.67-19.955 16.185-28.888 25.403l123.983 123.983V4.506c-6.87 1.358-13.627 3.041-20.28 4.974z"
      style={{fill: "#fff"}}/>
  <path
      d="m170.511 306.056-.711.715h.711zM190.084 286.487h.71v-.714zM281.229 196.737h-.684v.688zM171.21 176.457l-.699-.703v.703zM190.794 196.037v.7h.7z"
      style={{fill: "#d32030"}}/>
  <path
      d="M300.825 411.764v53.091a235.482 235.482 0 0 0 70.211-32.897l-57.526-57.526c-4.597 16.151-6.279 24.501-12.685 37.332zM313.812 108.471l62.799-62.799a235.938 235.938 0 0 0-75.787-36.854v54.538c7.386 14.79 8.007 26.028 12.988 45.115zM427.029 377.984c15.815-21.275 28.141-45.29 36.147-71.213h-107.36l71.213 71.213zM465.887 176.457c-7.188-27.318-19.143-52.676-34.898-75.192l-75.2 75.192h110.098z"
      style={{fill: "#252f6c"}}/>
  <path
      d="m327.638 290.5 16.275 16.275 77.903 77.903c1.769-2.214 3.526-4.42 5.217-6.69l-71.213-71.213h107.36c2.046-6.638 3.784-13.41 5.25-20.284H329.16c-.228 2.876-1.249 1.152-1.522 4.009zM311.352 120.348l70.607-70.615a245.581 245.581 0 0 0-5.348-4.061l-62.799 62.799c.651 2.483-3.066 9.334-2.46 11.877zM300.825 58.992V8.814a236.39 236.39 0 0 0-20.284-4.727v24.476c7.547 8.182 14.312 18.459 20.284 30.429zM326.041 196.737h144.195c-1.171-6.866-2.599-13.635-4.345-20.284H355.793l75.2-75.192a238.044 238.044 0 0 0-24.584-29.696l-84.702 84.694c2.281 15.363 3.302 24.285 4.334 40.478zM310.088 371.002l60.952 60.959c10.138-6.982 19.685-14.753 28.593-23.189l-80.173-80.177c-2.559 14.828-5.595 29.15-9.372 42.407zM280.545 442.301v27.28a233.85 233.85 0 0 0 20.284-4.727v-53.091c-5.976 11.975-12.741 22.367-20.284 30.538z"
      style={{fill: "#e7e7e7"}}/>
  <path
      d="m321.707 156.259 84.694-84.694a236.803 236.803 0 0 0-24.446-21.832l-66.55 66.561c2.958 12.363 4.301 26.514 6.302 39.965z"
      style={{fill: "#d71f28"}}/>
  <path
      d="M225.019.292zM236.836 473.68c-3.938 0-7.872-.108-11.81-.299 3.916.198 7.85.299 11.81.299zM236.836 473.68c14.943 0 29.535-1.447 43.708-4.099v-27.28c-12.441 13.485-26.995 31.379-43.708 31.379z"
      style={{fill: "#d32030"}}/>
  <path
      d="M470.232 196.737H327.911c1.885 29.704 1.657 60.249-.681 89.75h141.2a237.59 237.59 0 0 0 5.25-49.643c0-13.68-1.219-27.06-3.448-40.107zM327.638 290.5c-1.316 13.994-5.901 24.898-8.182 38.099l80.173 80.173a239.086 239.086 0 0 0 22.183-24.094l-77.9-77.907-16.274-16.271z"
      style={{fill: "#d71f28"}}/>
  <path d="M280.545 30.324V4.091C266.376 1.447 251.784 0 236.836 0c16.713 0 31.267 16.843 43.709 30.324z"
        style={{fill: "#d32030"}}/>
  <path
      d="M300.825 422.007c6.406-12.834 11.899-27.609 16.499-43.757l-16.499-16.499v60.256zM319.377 102.906c-4.989-19.087-11.166-36.439-18.552-51.229v69.773l18.552-18.544z"
      style={{fill: "#29337a"}}/>
  <path
      d="M332.234 295.092c.269-2.857.512-5.725.744-8.605h-9.349l8.605 8.605zM300.825 121.451V51.674c-5.976-11.97-12.737-22.254-20.284-30.429v129.906l40.735-40.735a457.616 457.616 0 0 0-1.9-7.517l-18.551 18.552zM281.229 196.737h52.429c-1.028-16.192-2.666-32.123-4.944-47.482l-47.485 47.482zM280.545 452.432c7.547-8.182 14.308-18.459 20.284-30.429v-60.256l16.499 16.499c3.784-13.264 6.959-27.434 9.525-42.261l-46.307-46.304-.001 162.751z"
      style={{fill: "#fff"}}/>
  <path
      d="M280.545 452.432V289.681l46.304 46.307c2.277-13.205 4.069-26.899 5.381-40.896l-8.605-8.605h9.349c2.337-29.502 2.565-60.047.681-89.75h-52.429l47.482-47.482c-2.001-13.455-4.476-26.469-7.434-38.836l-40.728 40.735V21.248C268.103 7.763 253.549 0 236.836 0c-3.938 0-7.872.101-11.817.292a238.416 238.416 0 0 0-34.225 4.215v191.531L66.808 72.055a239.134 239.134 0 0 0-21.189 25.089l79.313 79.313 20.291 20.284H3.448C1.227 209.784 0 223.164 0 236.844c0 17.034 1.84 33.626 5.25 49.643h184.834L70.847 405.724a238.535 238.535 0 0 0 24.921 21.349l95.023-95.023v137.116a238.638 238.638 0 0 0 34.232 4.215c3.938.191 7.872.299 11.81.299 16.716 0 31.27-7.763 43.712-21.248z"
      style={{fill: "#e51d35"}}/>
</svg>

                                          </span>
                                        London
                                    </a>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <Accordion type="single" collapsible>
                            <AccordionItem className={'pr-4'} value="dubai">
                                <AccordionTrigger
                                    className={'flex py-1 pb-2 items-center  px-4 space-x-2 text-white text-xs pr-6'}>
                                       <span>

                                       </span> AED
                                </AccordionTrigger>
                                <AccordionContent className={'flex pl-8 text-xs text-white'}>
                                    <a className={'inline-flex py-2'} href="https://trpe.co.uk" target="_blank">
                                          <span className="mr-1">

                                          </span>
                                        GBP
                                    </a>
                                </AccordionContent>
                                <AccordionContent className={'flex pl-8 text-xs text-white'}>
                                    <a className={'inline-flex py-2'} href="https://trpe.co.uk" target="_blank">
                                          <span className="mr-1">

                                          </span>
                                        EUR
                                    </a>
                                </AccordionContent>
                                <AccordionContent className={'flex pl-8 text-xs text-white'}>
                                    <a className={'inline-flex py-2'} href="https://trpe.co.uk" target="_blank">
                                          <span className="mr-1">

                                          </span>
                                        USD
                                    </a>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        <div className={'py-2 px-4 '}>
                            <div className="">
                                <div className={'rounded-full border-white border overflow-hidden text-xs'}>
                                    <button
                                        onClick={handleSetSqf}
                                        className={`${sizeType === 'sqf' ? 'bg-white text-black' : 'bg-transparent text-white'} px-3 py-1`}>
                                        SQF
                                    </button>
                                    <button
                                        onClick={handleSetSqm}
                                        className={`${sizeType === 'sqm' ? 'bg-white text-black' : 'bg-transparent text-white'} px-3 py-1`}>
                                        SQM
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const FloatingOptionsComponent = memo(FloatingOptions);
FloatingOptionsComponent.displayName = 'FloatingOptions';

export default FloatingOptionsComponent;