const Notification = ({ message }) => {
  // !message - checks if message is null, undefined, or falsy
  // !message.text - checks if there's no text property inside message
  if (!message || !message.text) return null;

  return <div className={`notification ${message.type}`}> {message.text} </div>;
};

export default Notification;
