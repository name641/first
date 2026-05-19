import { Link } from "react-router-dom";

export default function FeatureList() {
  const features = [
    {
      id: 1,
      name: "タスク管理",
      description: "タスクの作成・編集・削除ができます",
      status: "利用可能",
      path: "/Tasks",
    },
  ];

  return (
    <div className="container py-4">
      <h1 className="mb-4">機能一覧</h1>

      <div className="list-group">
        {features.map((feature) => (
          <Link
            key={feature.id}
            to={feature.path}
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex w-100 justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">{feature.name}</h5>

                <p className="mb-1 text-muted">
                  {feature.description}
                </p>
              </div>

              <span className="badge bg-primary">
                {feature.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

