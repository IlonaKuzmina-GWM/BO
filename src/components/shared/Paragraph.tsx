interface IParagraph {
    text: string;
    className?: string;
}
const Paragraph = ({text, className}: IParagraph) => {
    const defaultClassName = "font-inter text-[16px] leading-[24px] text-main pb-[16px]";
    return (
        <p className={className ? className : defaultClassName}>{text}</p>
    );
}
export default Paragraph;