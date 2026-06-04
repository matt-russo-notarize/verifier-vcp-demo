import { Tabs } from "../common/tabs";
import { Visualizer } from "../common/visualizer";
import { Code } from "../common/code";

export function ProtocolPanel({
  presentation,
  requestParams,
  endpoint,
}: {
  presentation: Record<string, unknown> | null;
  requestParams: Record<string, unknown>;
  endpoint: string;
}) {
  return (
    <Tabs
      selectedTab={presentation ? "presentation" : "request"}
      tabs={[
        {
          key: "request",
          label: "Request",
          content: (
            <div className="flex flex-col gap-6 pt-2">
              <div>
                <p className="mb-2 text-sm font-bold">Request endpoint:</p>
                <Code label="Authorization endpoint URL">{endpoint}</Code>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold">Request payload:</p>
                <Visualizer
                  data={requestParams}
                  defaultOpenKeys={["transaction_data", "payload"]}
                />
              </div>
            </div>
          ),
        },
        {
          key: "presentation",
          label: "Presentation",
          content: (
            <div className="flex flex-col gap-6 pt-2">
              <Visualizer
                data={presentation}
                defaultOpenKeys={[
                  "proof_id_default",
                  "payload",
                  "disclosures",
                  "kbJwt",
                ]}
              />
            </div>
          ),
        },
      ]}
    />
  );
}
