import { useCallback, useEffect, useState } from "react";

const DEFAULT_API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function App() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);
  const [dados, setDados] = useState(null);
  const [status, setStatus] = useState("idle");
  const [erro, setErro] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [ultimaConsulta, setUltimaConsulta] = useState("");

  const consultarApi = useCallback(async () => {
    const baseLimpa = apiBase.trim().replace(/\/+$/, "");
    const endpoint = `${baseLimpa}/api/data-hora`;

    setStatus("loading");
    setErro("");

    try {
      const resposta = await fetch(endpoint);

      if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status} ao consultar ${endpoint}`);
      }

      const json = await resposta.json();
      setDados(json);
      setStatus("success");
      setUltimaConsulta(new Date().toLocaleTimeString("pt-BR"));
    } catch (falha) {
      setStatus("error");
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

  const endpointAtual = `${apiBase.trim().replace(/\/+$/, "")}/api/data-hora`;

  return (
    <div className="pagina">
      <main className="painel">
        <header className="cabecalho">
          <span className="etiqueta">AULA 04 — CONSUMINDO APIS NO FRONT-END</span>
          <h1>Consulta de Data e Hora</h1>
          <p>
            Aplicação Front-end em <strong>React</strong> consumindo a rota{" "}
            <code>GET /api/data-hora</code> da API REST desenvolvida em{" "}
            <strong>Node.js + Express.js</strong>.
          </p>
        </header>

        <section className="configuracao" aria-label="Configuração do Endpoint">
          <label htmlFor="campo-api">URL base da API (local ou Render)</label>
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
              onClick={consultarApi}
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
                Verifique se o servidor <code>datetime-api-express</code> está
                em execução (<code>node api.js</code>) ou informe a URL pública
                do Render acima.
              </small>
            </div>
          )}

          {dados && (
            <>
              <div className="grade-relogio">
                <article className="cartao-valor">
                  <span className="rotulo-cartao">📅 Data retornada</span>
                  <strong className="valor-destaque">{dados.data}</strong>
                  <small>Fuso horário: America/Sao_Paulo</small>
                </article>

                <article className="cartao-valor">
                  <span className="rotulo-cartao">⏰ Hora retornada</span>
                  <strong className="valor-destaque">{dados.hora}</strong>
                  <small>Última leitura: {ultimaConsulta}</small>
                </article>
              </div>

              <div className="bloco-json">
                <div className="topo-json">
                  <span>Resposta JSON recebida do Backend</span>
                  <span className="badge-ok">HTTP 200 OK</span>
                </div>
                <pre>{JSON.stringify(dados, null, 2)}</pre>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
