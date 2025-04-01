export const SuccessText: React.FC<{ pointer?: string }> = (props) => {
  return (
    <span style={{ color: '#389e0d', cursor: props.pointer ? 'pointer' : undefined }}>
      { props.children }
    </span>
  )
}
