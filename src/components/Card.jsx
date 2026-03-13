export default function Card({ title, value }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p className="value">{value}</p>
    </div>
  )
}