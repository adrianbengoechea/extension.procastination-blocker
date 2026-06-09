import type { Site } from "../../interfaces/site";

type Props = {
  site: Site;
  onToggle: () => void;
  onRemove: () => void;
};

export default function ListItem({ site, onToggle, onRemove }: Props) {
  return (
    <li>
      {site.url}
      <input type="checkbox" checked={site.active} onChange={onToggle} />
      <button onClick={onRemove} style={{ marginLeft: "10px" }}>
        Remove
      </button>
    </li>
  );
}
