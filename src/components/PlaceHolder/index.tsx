interface IPlaceHolderProps {
  /**
   * 原本的文本
   */
  text?: string;
  /**
   * 原本文本为空时的占位文本
   */
  placeHolderText?: string;
  /**
   * 是否斜体并设置颜色为#aaa
   */
  isItalic?: boolean;
}
export function PlaceHolder(props: IPlaceHolderProps) {
  const { placeHolderText = '未设置', isItalic = true, text } = props;
  if (text) {
    return <span>{text}</span>;
  }
  if (isItalic) {
    return <i style={{ color: '#aaa' }}>{placeHolderText}</i>;
  }
  return <span>{placeHolderText}</span>;
}
