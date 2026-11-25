import { useCallback, useEffect, useState } from "react";

const DEFAULT_API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const PRESETS = [
  { rotulo: "Local (localhost:3000)", url: "http://localhost:3000" },
  { rotulo: "Render Cloud", url: "https://datetime-api-express.onrender.com" },
];

export default function App() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);
  const [dados, setDados] = useState(null);
  const [status, setStatus] = useState("idle");
  const [erro, setErro] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [ultimaConsulta, setUltimaConsulta] = useState("");
  const [latenciaMs, setLatenciaMs] = useState(null);

  const consultarApi = useCallback(async (baseOverride) => {
    const baseAlvo = typeof baseOverride === "string" ? baseOverride : apiBase;
    const baseLimpa = baseAlvo.trim().replace(/\/+$/, "");
    const endpoint = `${baseLimpa}/api/data-hora`;

    setStatus("loading");
    setErro("");
    const inicio = performance.now();

    try {
      const resposta = await fetch(endpoint);

      if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status} ao consultar ${endpoint}`);
      }

      const json = await resposta.json();
      const duracao = Math.round(performance.now() - inicio);

      setDados(json);
      setLatenciaMs(duracao);
      setStatus("success");
      setUltimaConsulta(new Date().toLocaleTimeString("pt-BR"));
    } catch (falha) {
      setStatus("error");
      setLatenciaMs(null);
      setErro(
        falha instanceof Error
          ? falha.message
          : "Não foi possível conectar à API Express."
      );
    }
  }, [apiBase]);

  useEffect(() => {
    consultarApi();
  }, [consultarApi]);

  useEffect(() => {
    if (!autoRefresh) return undefined;

    const timer = setInterval(() => {
      consultarApi();
    }, 5000);

    return () => clearInterval(timer);
  }, [autoRefresh, consultarApi]);

  function selecionarPreset(urlPreset) {
    setApiBase(urlPreset);
  }

  const endpointAtual = `${apiBase.trim().replace(/\/+$/, "")}/api/data-hora`;

  return (
    <div className="pagina">
      <main className="painel">
        <header className="cabecalho">
          <span className="etiqueta">AULA 04 — CONSUMINDO APIS NO FRONT-END</span>
          <h1>Consulta de Data e Hora em Tempo Real</h1>
          <p>
            Aplicação Front-end independente em <strong>React + Vite</strong>{" "}
            consumindo a rota <code>GET /api/data-hora</code> da API REST{" "}
            <strong>datetime-api-express</strong> (Node.js + Express.js).
          </p>
        </header>

        <section className="configuracao" aria-label="Configuração do Endpoint">
          <div className="topo-configuracao">
            <label htmlFor="campo-api">URL base da API (Local ou Render)</label>
            <div className="atalhos-api">
              {PRESETS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  className={`botao-preset ${apiBase === preset.url ? "ativo" : ""}`}
                  onClick={() => selecionarPreset(preset.url)}
                >
                  {preset.rotulo}
                </button>
              ))}
            </div>
          </div>

          <div className="linha-input">
            <input
              id="campo-api"
              type="url"
              value={apiBase}
              onChange={(evento) => setApiBase(evento.target.value)}
              placeholder="https://datetime-api-express.onrender.com"
            />
            <button
              type="button"
              className="botao-primario"
              onClick={() => consultarApi()}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Consultando..." : "Atualizar agora"}
            </button>
          </div>

          <div className="opcoes">
            <span className="endpoint-ativo">
              Endpoint ativo: <code>{endpointAtual}</code>
            </span>

            <label className="checkbox-auto">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(evento) => setAutoRefresh(evento.target.checked)}
              />
              Atualizar automaticamente a cada 5s
            </label>
          </div>
        </section>

        <section className="resultado" aria-live="polite">
          {status === "loading" && !dados && (
            <div className="estado-mensagem">
              Consultando servidor Express...
            </div>
          )}

          {status === "error" && (
            <div className="estado-erro" role="alert">
              <strong>Falha na comunicação com a API</strong>
              <p>{erro}</p>
              <small>
                Certifique-se de que o servidor{" "}
                <code>datetime-api-express</code> esteja em execução (
                <code>npm start</code>) ou conecte a URL publicada no Render.
              </small>
            </div>
          )}

          {dados && (
            <>
              <div className="grade-relogio">
                <article className="cartao-valor">
                  <span className="rotulo-cartao">📅 Data retornada pela API</span>
                  <strong className="valor-destaque">{dados.data}</strong>
                  <small>
                    {dados.diaSemana
                      ? `Dia: ${dados.diaSemana}`
                      : "Formato pt-BR"}
                  </small>
                </article>

                <article className="cartao-valor">
                  <span className="rotulo-cartao">⏰ Hora retornada pela API</span>
                  <strong className="valor-destaque">{dados.hora}</strong>
                  <small>
                    Fuso: {dados.fusoHorario || "America/Sao_Paulo"} • Leitura:{" "}
                    {ultimaConsulta}
                  </small>
                </article>
              </div>

              <div className="bloco-json">
                <div className="topo-json">
                  <span>Resposta JSON recebida do Backend Express</span>
                  <div className="badges-json">
                    {latenciaMs !== null && (
                      <span className="badge-latencia">{latenciaMs} ms</span>
                    )}
                    <span className="badge-ok">HTTP 200 OK</span>
                  </div>
                </div>
                <pre>{JSON.stringify(dados, null, 2)}</pre>
              </div>
            </>
          )}
        </section>

        <footer className="rodape-painel">
          <span>Disciplina: Frameworks Front-end — SENAI</span>
          <span>Prof. Me. Deivison S. Takatu</span>
        </footer>
      </main>
    </div>
  );
}
