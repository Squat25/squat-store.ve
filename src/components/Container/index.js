import { forwardRef } from "react";

const Container = forwardRef(function Container(
  {
    children,
    sectionClass = "",
    backgroundImage,
    mobileBackgroundImage,
    ...props
  },
  ref
) {
  return (
    <section
      ref={ref}
      className={`relative z-[1] py-12 lg:py-16 ${sectionClass}`}
      {...props}
    >
      {backgroundImage && (
        <div className="absolute inset-0 z-[-1]">
          <img
            className={`w-full h-full object-cover ${
              mobileBackgroundImage ? "hidden lg:block" : ""
            }`}
            src={backgroundImage.url || backgroundImage}
            alt={backgroundImage.alt || ""}
          />
          {mobileBackgroundImage && (
            <img
              className="w-full h-full object-cover lg:hidden"
              src={mobileBackgroundImage.url || mobileBackgroundImage}
              alt={mobileBackgroundImage.alt || ""}
            />
          )}
        </div>
      )}
      <div className="container relative mx-auto px-3 max-lg:max-w-[712px] max-md:max-w-[363px] md:px-4">
        {children}
      </div>
    </section>
  );
});

export default Container;
