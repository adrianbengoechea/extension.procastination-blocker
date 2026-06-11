interface Props {
  title: string;
  topic: string[];
  checked: boolean;
  onToggle: () => void;
}

export const TopicList = ({ title, topic, checked, onToggle }: Props) => {
  const wrapperStyles = `block border-1 border-solid p-4 ${checked ? 'border-green' : 'border-black'}`;

  return (
    <div className={wrapperStyles}>
      <h3>{title}</h3>
      <label>
        <input type="checkbox" checked={checked} onInput={onToggle} /><span>Block sites</span>
      </label>
      <h4>Target sites:</h4>
      <ul>
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
