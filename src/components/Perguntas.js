import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Perguntas = () => {
  const [perguntas, setPerguntas] = useState([]);
  const [respostasSelecionadas, setRespostasSelecionadas] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchPerguntas = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/perguntas`);
        setPerguntas(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
        setLoading(false);
      }
    };

    fetchPerguntas();
  }, []);

  const handleSelecionarResposta = (perguntaId, opcaoId) => {
    setRespostasSelecionadas({
      ...respostasSelecionadas,
      [perguntaId]: opcaoId,
    });
  };

  const handleSubmeterRespostas = () => {
    const novoFeedback = {};
    perguntas.forEach((pergunta) => {
      const respostaCorreta = pergunta.opcoes_resposta.find((opcao) => opcao.correta);
      const respostaSelecionadaId = respostasSelecionadas[pergunta.id];

      if (respostaSelecionadaId) {
        novoFeedback[pergunta.id] = respostaSelecionadaId === respostaCorreta?.id
          ? 'Correto!'
          : 'Incorreto.';
      } else {
        novoFeedback[pergunta.id] = 'Nenhuma resposta selecionada.';
      }
    });
    setFeedback(novoFeedback);
  };

  if (loading) return <p>Carregando perguntas...</p>;

  return (
    <div>
      <h1>Quiz</h1>
      {perguntas.map((pergunta) => (
        <div key={pergunta.id} className="pergunta">
          <h2>{pergunta.titulo}</h2>
          {(pergunta.opcoes_resposta || []).map((opcao) => (
            <div key={opcao.id}>
              <input
                type="radio"
                id={`opcao-${opcao.id}`}
                name={`pergunta-${pergunta.id}`}
                checked={respostasSelecionadas[pergunta.id] === opcao.id}
                onChange={() => handleSelecionarResposta(pergunta.id, opcao.id)}
              />
              <label htmlFor={`opcao-${opcao.id}`}>{opcao.texto}</label>
            </div>
          ))}
          {feedback[pergunta.id] && (
            <p className="feedback">{feedback[pergunta.id]}</p>
          )}
        </div>
      ))}
      <button onClick={handleSubmeterRespostas}>Submeter Respostas</button>
    </div>
  );
};

export default Perguntas;

