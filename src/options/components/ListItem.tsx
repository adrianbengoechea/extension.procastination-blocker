type Props = {
  site: string;
  onRemove: () => void;
};

export default function ListItem({ site, onRemove }: Props) {
  return (
    <li>
      {site}
      <button onClick={onRemove} style={{ marginLeft: "10px" }}>
        Remove
      </button>
    </li>
  );
}
