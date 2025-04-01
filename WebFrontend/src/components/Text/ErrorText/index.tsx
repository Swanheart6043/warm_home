export const ErrorText: React.FC<{ pointer?: string | boolean }> = (props) => {
  return (
    <span style={{ color: '#ff4d4f', cursor: props.pointer ? 'pointer' : undefined }} {...props}>
      { props.children }
    </span>
  )
}
