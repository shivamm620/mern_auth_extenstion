function Button({ ...props }) {
  return (
    <button
      type={props.type}
      onClick={props.onclick}
      disabled={props.disabled || false}
    >
      {props.bntText}
    </button>
  );
}

export default Button;
