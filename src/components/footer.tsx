import Image from 'next/image';

const Footer = () => {
  return (
    <>
      <div className='mt-12 flex h-[120px] flex-col justify-center border-t border-t-border '>
        <span className='text-xl font-semibold'>skidddle</span>
        <span>© Built by Adam Ridhwan</span>
      </div>
    </>
  );
};

export default Footer;
