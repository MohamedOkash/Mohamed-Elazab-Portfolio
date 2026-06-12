/**
 * Static text wrapper. Inline editing triggers are removed from public pages
 * to ensure all edits occur exclusively within the secure CMS dashboard.
 */
export const EditableText = ({ text, tagName: Tag = 'span', className }) => {
  return (
    <Tag className={className}>
      {text}
    </Tag>
  );
};

export default EditableText;
