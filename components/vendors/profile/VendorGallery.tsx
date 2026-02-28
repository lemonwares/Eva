import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface VendorGalleryProps {
  images: string[];
  businessName: string;
}

export function VendorGallery({ images, businessName }: VendorGalleryProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  return (
    <section className="relative min-h-50">
      {/* Desktop: grid gallery, Mobile: carousel */}
      {images.length > 0 ? (
        <>
          <div className="hidden md:grid grid-cols-3 gap-4 max-w-7xl mx-auto h-[450px] mb-8">
            <div className="col-span-2 border border-gray-300 rounded-2xl h-full overflow-hidden">
              <Image
                src={images[0]}
                onClick={() => {
                  setShowImagesModal(true);
                  setModalImageIndex(0);
                }}
                alt="Vendor main"
                width={900}
                height={300}
                unoptimized={true}
                className="object-cover w-full h-full rounded-2xl shadow-lg hover:cursor-pointer"
                style={{ height: "100%", width: "100%" }}
                sizes="(max-width: 1200px) 100vw, 900px"
                priority
              />
            </div>
            <div className="flex flex-col gap-4 h-full">
              {images.slice(1, 3).map((img, idx) => {
                const isLast = idx === 1 && images.length > 3;
                return (
                  <div
                    key={idx}
                    className="h-1/2 w-full rounded-2xl border border-gray-300 shadow overflow-hidden relative"
                  >
                    <Image
                      src={img}
                      alt={`Vendor side ${idx + 1}`}
                      fill
                      unoptimized={true}
                      sizes="(max-width: 1200px) 100vw, 450px"
                      className="object-cover rounded-2xl"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setShowImagesModal(true);
                        setModalImageIndex(idx + 1);
                      }}
                    />
                    {isLast && (
                      <button
                        className="absolute bottom-3 right-0 -translate-x-1/2 bg-gray-400/50 hover:transition-all duration-300 hover:cursor-pointer text-accent-foreground px-4 py-2 rounded-full font-medium shadow hover:underline"
                        onClick={() => {
                          setShowImagesModal(true);
                          setModalImageIndex(0);
                        }}
                      >
                        See all images
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Mobile: carousel */}
          <div
            className="md:hidden flex items-center justify-center mb-8"
            style={{ width: "100%" }}
          >
            <div
              style={{
                width: "calc(100vw - 2rem)",
                maxWidth: "100%",
                aspectRatio: "16/9",
                position: "relative",
                overflow: "hidden",
                borderRadius: "1rem",
                background: "#f3f4f6",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  src={images[activeImageIndex]}
                  alt="Vendor"
                  className="object-cover w-full h-full"
                  style={{
                    borderRadius: "1rem",
                    display: "block",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              {/* Carousel navigation inside image */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1,
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition z-10"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImageIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1,
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition z-10"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              {/* Dots */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition ${
                        index === activeImageIndex
                          ? "bg-background w-6"
                          : "bg-background/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="md:hidden h-64 bg-muted rounded-2xl mb-8" />
      )}
      {/* See all images modal (desktop only) */}
      {showImagesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
          <div className="relative flex flex-col w-full h-full max-h-screen bg-background rounded-none p-0 md:p-8 shadow-xl overflow-y-auto">
            <button
              onClick={() => setShowImagesModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition z-50"
              aria-label="Close"
            >
              <X size={28} />
            </button>
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center pt-12 md:pt-16 px-4 md:px-0">
              <div className="w-full ">
                <h2 className="text-4xl max-md:text-3xl font-bold mb-1">
                  Image gallery
                </h2>
                <p className="text-muted-foreground mb-6 text-2xl max-md:text-lg">
                  {businessName}
                </p>
              </div>
              {/* Large image at the top, full width */}
              {images[0] && (
                <div className="w-full mb-8">
                  <Image
                    src={images[0]}
                    alt="Gallery main image"
                    width={1200}
                    height={500}
                    unoptimized={true}
                    className="object-cover w-full h-[350px] md:h-[400px] rounded-2xl shadow-lg"
                    style={{ background: "#f3f4f6" }}
                  />
                </div>
              )}
              {/* Grid of smaller images below, 2 columns */}
              <div className="w-full overflow-y-auto pb-8">
                <div className="grid grid-cols-2 gap-6">
                  {images.slice(1).map((img, idx) => (
                    <div key={idx} className="relative">
                      <Image
                        src={img}
                        alt={`Gallery image ${idx + 2}`}
                        width={600}
                        height={350}
                        unoptimized={true}
                        className="object-cover w-full h-[200px] md:h-[250px] rounded-2xl shadow"
                        style={{ background: "#f3f4f6" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
