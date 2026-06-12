import { Tabs } from "../common/tabs";
import { Visualizer } from "../common/visualizer";
import { Code } from "../common/code";
import { Details } from "../common/details";

export function ProtocolPanel({
  presentation,
  rawToken,
  error,
  requestParams,
  endpoint,
}: {
  presentation: Record<string, unknown> | null;
  rawToken: string | null;
  error: string | null;
  requestParams: Record<string, unknown>;
  endpoint: string;
}) {
  return (
    <Tabs
      selectedTab={presentation || error ? "presentation" : "request"}
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
              {rawToken && (
                <Details label="Raw vp_token">
                  <Code label="Raw vp_token">{rawToken}</Code>
                </Details>
              )}
              {error ? (
                <div className="rounded bg-gray-950 px-3 py-2 font-mono text-sm text-red-400">
                  {error}
                </div>
              ) : (
                <Visualizer
                  data={presentation}
                  defaultOpenKeys={[
                    "proof_id_default",
                    "payload",
                    "disclosures",
                    "kbJwt",
                  ]}
                />
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
