interface Props {
  title: string;
  topic: string[];
  checked: boolean;
  onToggle: () => void;
}

export const TopicList = ({ title, topic, checked, onToggle }: Props) => {
  const wrapperStyles = {
    border: '1px solid black',
    display: 'block',
    padding: '10px 30px 20px',
    borderRadius: '10px',
    background: '#FFF',
    boxShadow: '0px 3px 10px rgba(0, 0,0, 0.2)',
    width: '100%',
    maxWidth: '140px'
  }

  if (checked) {
    wrapperStyles.border = '1px solid green';
  }

  return (
    <div style={wrapperStyles}>
      <h3>{title}</h3>
      <label>
        <input type="checkbox" checked={checked} onInput={onToggle} /><span>Block sites</span>
      </label>
      <h4>Target sites:</h4>
      <ul style={{paddingLeft: '16px'}}>
        {
          topic.map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )
        }
      </ul>
    </div>
  )
}
