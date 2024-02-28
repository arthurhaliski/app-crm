import React, { useState, useRef, useEffect, useCallback  } from 'react';
import A4 from './A4'; // Ajuste o caminho de importação conforme necessário
import styles from "./A4Editor.module.css";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';



const A4Editor = () => {
  const [nomeObra, setNomeObra] = useState('');
  const [nomeConstrutora, setNomeConstrutora] = useState('');
  const [nomeResponsavel, setNomeResponsavel] = useState('');
  const [telefoneResponsavel, setTelefoneResponsavel] = useState('');
  const [nomeReferencia, setNomeReferencia] = useState('');
  const [itens, setItens] = useState([]);
  
  // Estados para as propriedades do item a ser adicionado ou editado
  const [itemNome, setItemNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [unidade, setUnidade] = useState('m²');
  const [razao, setRazao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [editandoIndex, setEditandoIndex] = useState(-1); // Novo estado para rastrear o índice do item sendo editado

  //Detalhes Finais
  const [valorFrete, setFrete] = useState('0');
  const [valorDeslocamento, setDeslocamento] = useState('0');
  const [formaDePagamento, setFormaDePagamento] = useState('');
  const [prazoEntrega, setPrazo] = useState('');
  
  // Nome do arquivo do orçamento
  const nomeOrcamento = nomeObra ? `Orçamento ${nomeObra}.pdf` : 'Orçamento.pdf';

  const componentRef = useRef();
  const generatePDF = () => {
    const input = componentRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(nomeOrcamento);
    });
  };

  const enviarDescricao = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/melhorar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descricao: descricao }),
      });
      if (!response.ok) throw new Error('Erro ao processar a descrição');
      const data = await response.json();
      setDescricao(data.message); // Ajuste aqui para acessar 'message' em vez de 'descricaoMelhorada'
      console.log(data.message);
    } catch (error) {
      console.error('Falha ao enviar descrição:', error);
    }
  }, [descricao]);
  

  


const adicionarOuEditarItem = () => {
  const novaRazaoFormatada = `R$${valor} p/${unidade}`; // Formatação da string conforme solicitado
  const novoItem = {
    itemNome,
    descricao,
    razao: novaRazaoFormatada,
    quantidade: Number(quantidade),
  };
  
  if (editandoIndex >= 0) {
    // Edita o item existente
    const novosItens = [...itens];
    novosItens[editandoIndex] = novoItem;
    setItens(novosItens);
    setEditandoIndex(-1); // Reseta o índice de edição
  } else {
    // Adiciona um novo item
    setItens([...itens, novoItem]);
  }
  
  // Limpa todos os campos, incluindo Valor e Unidade
  limparCampos();
};

const limparCampos = () => {
  setItemNome('');
  setDescricao('');
  setValor('');
  setUnidade('m²'); // Assegura que a unidade seja resetada para o valor padrão se necessário
  setQuantidade('');
};

// Função editarItem atualizada para lidar com Valor e Unidade
const editarItem = (index) => {
  const item = itens[index];
  // Extrai Valor e Unidade da string razao
  const [razaoValor, razaoUnidade] = item.razao.replace('R$ ', '').split(' p/');
  setItemNome(item.itemNome);
  setDescricao(item.descricao);
  setValor(razaoValor); // Seta apenas o valor numérico
  setUnidade(razaoUnidade); // Seta a unidade (ex: Kg)
  setQuantidade(item.quantidade);
  setEditandoIndex(index);
};


  const removerItem = (index) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.fullPage}>
      <div className={styles.settings}>
        <div className={styles.titulo}> 
        <span className={styles.titulofont}>DETALHES</span>
        <div className={styles.part1}> 
        <div className={styles.parte1detalhes}>
            <div className={styles.box}>
          <label>Nome da Obra</label>
          <input
            type="text"
            value={nomeObra}
            onChange={(e) => setNomeObra(e.target.value)}
          />
          </div>
        </div>
        <div className={styles.parte2detalhes}>
        <div className={styles.box}>
          <label>Nome da Construtora</label>
          <input
            type="text"
            value={nomeConstrutora}
            onChange={(e) => setNomeConstrutora(e.target.value)}
          />
          </div>
            <div className={styles.box}>
          <label>Nome do Responsável</label>
          <input
            type="text"
            value={nomeResponsavel}
            onChange={(e) => setNomeResponsavel(e.target.value)}
          />
          </div>
          </div>
          <div className={styles.parte2detalhes}>
<div className={styles.box}>
          <label>Telefone do Responsável</label>
          <input
            type="text"
            value={telefoneResponsavel}
            onChange={(e) => setTelefoneResponsavel(e.target.value)}
          />
          </div>
<div className={styles.box}>
          <label>Nome da Referência</label>
          <input
            type="text"
            value={nomeReferencia}
            onChange={(e) => setNomeReferencia(e.target.value)}
          />
          </div>
          </div>
        </div>
        </div>
        <div className={styles.titulo}> 
        <span className={styles.titulofont}>ORÇAMENTO</span>
        <div className={styles.part2}>
        <div className={styles.parte1orcamento}>
        <div className={styles.box}>
          <label>Nome do Item</label>
          <input
            type="text"
            value={itemNome}
            onChange={(e) => setItemNome(e.target.value)}
          />
          </div>
          <div className={styles.box2}>
            <label>Descrição</label>
            <textarea
                rows="5"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
            ></textarea>
        <button className={styles.roundedButton} onClick={enviarDescricao}>Melhorar Descrição</button>

            </div>
          </div>
        
        <div className={styles.parte2orcamento}>
        <div className={styles.box}>
          <label>Valor Unitário (R$)</label>
          <input
            type="number"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          </div>
          <div className={styles.box}>
            <label>Unidade</label>
            <select value={unidade} onChange={(e) => setUnidade(e.target.value)}>
                <option value="m²">m²</option>
                <option value="Kg">Kg</option>
                <option value="CJ">CJ</option>
            </select>
            </div>

        <div className={styles.box}>
          <label>Quantidade</label>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
          </div>
          </div>
        </div>
        <button className={styles.roundedButton} onClick={adicionarOuEditarItem}>
          {editandoIndex >= 0 ? 'Salvar Edição' : 'Adicionar Item'}
        </button>
        </div>   
      {/* Renderização da lista de itens e botões de ação */}
      {itens.map((item, index) => (
        <div key={index} className={styles.itemList}>
          <div>Nome: {item.itemNome}</div>
          <div>Descrição: {item.descricao}</div>
          <div>Razão: {item.razao}</div>
          <div>Quantidade: {item.quantidade}</div>
          <div>
          <button className={styles.roundedButton1} onClick={() => editarItem(index)}>Editar Linha</button>
          <button className={styles.roundedButton2} onClick={() => removerItem(index)}>Remover Linha</button>
		  </div>
          </div>
		  ))}
        <div className={styles.titulo}> 
        <span className={styles.titulofont}>DETALHES FINAIS</span>
        <div className={styles.parte2detalhes}>
        <div className={styles.box}>
          <label>Valor do Frete</label>
          <input
            type="number"
            value={valorFrete}
            onChange={(e) => setFrete(e.target.value)}
          />
          </div>
          <div className={styles.box}>
          <label>Valor da Mobilização</label>
          <input
            type="number"
            value={valorDeslocamento}
            onChange={(e) => setDeslocamento(e.target.value)}
          />
          </div>
          </div>
          <div>
          <div className={styles.box3}>
            <div className={styles.box2}>
            <label>Prazo de Entrega</label>
            <textarea
                rows="2"
                value={prazoEntrega}
                onChange={(e) => setPrazo(e.target.value)}
            ></textarea>
            </div>
            <div className={styles.box2}>
            <label>Forma de Pagamento</label>
            <textarea
                rows="2"
                value={formaDePagamento}
                onChange={(e) => setFormaDePagamento(e.target.value)}
            ></textarea>
            </div>
            </div>
          </div>
        </div>
        <button className={styles.roundedButton} onClick={generatePDF}>Salvar como PDF</button>

        </div>
        <A4
        ref={componentRef} 
        nomeObra={nomeObra}
        nomeConstrutora={nomeConstrutora}
        nomeResponsavel={nomeResponsavel}
        telefoneResponsavel={telefoneResponsavel}
        nomeReferencia={nomeReferencia}
        itens={itens}
        valorFrete={valorFrete}
        valorDeslocamento={valorDeslocamento}
        formaPagamento={formaDePagamento}
        prazoEntrega={prazoEntrega}
      />
      
    </div>
  );
};

export default A4Editor;
