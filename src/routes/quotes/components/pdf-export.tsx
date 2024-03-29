import React, { useState, useRef, useEffect, useCallback  } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Item from "./A4/components/Item";
import styles from "./A4/A4.module.css";
import { Button, Modal } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { useOne } from "@refinedev/core";
import { useParams } from "react-router-dom";

import { QuotesGetQuoteQuery } from "@/graphql/types";
import { currencyNumber } from "@/utilities";

import { QUOTES_GET_QUOTE_QUERY } from "../queries";


const A4 = ({
}) => {
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
  const [formaPagamento, setFormaDePagamento] = useState('');
  const [prazoEntrega, setPrazo] = useState('');
  
  // Nome do arquivo do orçamento
  const nomeOrcamento = nomeObra ? `Orçamento ${nomeObra}.pdf` : 'Orçamento.pdf';
      // Gera um número aleatório entre 99 e 9999
  const numeroOrcamento = Math.floor(Math.random() * (9999 - 99 + 1)) + 99;

      // Obtém a data atual no formato dd/mm/yyyy
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  

  const pdfRef = useRef();
  
  const params = useParams<{ id: string }>();

  const orcamentoRef = useRef(null);
  const a46InnerRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar a visibilidade do modal

  const showPDFPreview = () => {
    setIsModalVisible(true); // Mostra o modal ao invés de gerar o PDF diretamente
  };

  const handleSavePDF = () => {
    html2canvas(pdfRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${nomeObra || "Orçamento"}.pdf`);
      setIsModalVisible(false); // Fecha o modal após salvar o PDF
    });
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === orcamentoRef.current && a46InnerRef.current) {
          const orcamentoHeight = entry.contentRect.height * 1.3;
          a46InnerRef.current.style.height = `${orcamentoHeight}px`;
        }
      }
    });

    if (orcamentoRef.current) {
      resizeObserver.observe(orcamentoRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const generatePDF = () => {
    html2canvas(pdfRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${nomeObra || "Orçamento"}.pdf`);
    });
  };

  const extrairValor = (razao) => {
    const valor = razao.match(/R\$(\d+(?:\.\d+)?)/);
    return valor ? parseFloat(valor[1]) : 0;
  };

  const calcularSubtotal = () => {
    return itens.reduce((subtotal, item) => {
      const valorItem = extrairValor(item.razao) * item.quantidade;
      return subtotal + valorItem;
    }, 0);
  };

  const subtotal = calcularSubtotal();
  const frete = parseFloat(valorFrete);
  const deslocamento = parseFloat(valorDeslocamento);
  const totalGeral = subtotal + frete + deslocamento;
  const { data, isLoading, isFetching, refetch } = useOne<
    GetFields<QuotesGetQuoteQuery>
  >({
    resource: "quotes",
    id: params.id,
    liveMode: "off",
    meta: {
      gqlQuery: QUOTES_GET_QUOTE_QUERY,
    },
  });
  const {
    title,
    tax,
    total,
    subTotal,
    items,
    description,
    company,
    contact,
    salesOwner,
  } = data?.data || {};
  return (
    <div>
      {/* Botão para gerar PDF */}
      <Button onClick={showPDFPreview} type="primary" icon={<FilePdfOutlined />}>
        Visualizar Orçamento
      </Button>

      <Modal
        title="Pré-visualização do PDF"
        visible={isModalVisible}
        onOk={handleSavePDF}
        onCancel={() => setIsModalVisible(false)}
        okText="Salvar PDF"
        cancelText="Cancelar"
      >
        <p>Confira a pré-visualização do PDF antes de salvar.</p>

        <div ref={pdfRef} className={styles.a46}>
      <div ref={a46InnerRef} className={styles.a46Inner}>
        <div className={styles.frameWrapper}>
          <div className={styles.frameParent}>
            <div className={styles.lindtCatuaiShoppingMariParent}>
              <div className={styles.lindtCatuai}>
                {title}
              </div>
              <div className={styles.shmvConstrutoraAttContainer}>
                <p className={styles.shmvConstrutora}>{nomeConstrutora}</p>
                <p className={styles.attGustavo}>Att: {company?.name}</p>
              </div>
              <div className={styles.fone11998140787Container}>
                <p className={styles.refernciaProjetoEstrutura}>
                  <span className={styles.fone}>{`Fone: `}</span>
                  <span>{telefoneResponsavel}</span>
                </p>
                <p className={styles.departamentoEngenharia}>
                  <span
                    className={styles.departamento}
                  >{`Departamento: `}</span>
                  <span className={styles.engenharia}> Engenharia</span>
                </p>
                <p className={styles.refernciaProjetoEstrutura}>
                  <span className={styles.fone}>{`Referência: `}</span>
                  <span> {nomeReferencia}</span>
                </p>
              </div>
            </div>
            <div className={styles.detalhesDoOramentoParent}>
              <div className={styles.detalhesDoOramento}>
                Detalhes do Orçamento:
              </div>
              <div className={styles.nOramento20292023Parent}>
                <div className={styles.shmvConstrutoraAttContainer}>
                  <span
                    className={styles.departamento}
                  >{`Nº Orçamento: `}</span>
                  <span className={styles.span}>{numeroOrcamento}</span>
                </div>
                <div className={styles.shmvConstrutoraAttContainer}>
                  <span className={styles.departamento}>{`Data: `}</span>
                  <span className={styles.span}>{dataAtual}</span>
                </div>
              </div>
            </div>
            <div className={styles.frameChild} />
            <div className={styles.frameGroup}>
              <div className={styles.ineditaPeasMetalrgicasAttParent}>
                <div className={styles.ineditaPeasMetalrgicasContainer}>
                  <p className={styles.shmvConstrutora}>
                    Inedita Peças Metalúrgicas
                  </p>
                  <p className={styles.attGustavo}>Att: Jackson Andrade</p>
                </div>
                <div className={styles.fone11998140787Container}>
                  <p className={styles.refernciaProjetoEstrutura}>
                    <span className={styles.fone}>{`Fone: `}</span>
                    <span>(11) 99920-6980</span>
                  </p>
                  <p className={styles.departamentoEngenharia}>
                    <span
                      className={styles.departamento}
                    >{`Departamento: `}</span>
                    <span className={styles.engenharia}> Comercial</span>
                  </p>
                </div>
              </div>
              <div className={styles.contatoWrapper}>
                <div className={styles.contato}>Contato:</div>
              </div>
              <div className={styles.shmvConstrutoraAttContainer}>
                <p className={styles.shmvConstrutora}>Email:</p>
                <p className={styles.attGustavo}>
                  jackson@ineditametalurgica.com.br
                </p>
              </div>
              <div className={styles.fone11998140787Container}>
                <p className={styles.endereo}>Endereço:</p>
                <p className={styles.refernciaProjetoEstrutura}>
                  Rodovia do Contorno Norte, 769 - Jd, César Augusto - Colombo,
                  PR.
                </p>
                <p className={styles.refernciaProjetoEstrutura}>
                  CEP: 82402-335
                </p>
                <p className={styles.refernciaProjetoEstrutura}>&nbsp;</p>
                <p className={styles.endereo}>Site:</p>
                <p className={styles.refernciaProjetoEstrutura}>
                  www.ineditametalurgica.com.br
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref={orcamentoRef} className={styles.orcamentogeral}>
        <div className={styles.topo}>
          <div className={styles.oramentoParent}>
            <div className={styles.oramento}>ORÇAMENTO</div>
          </div>
          <img className={styles.vectorIcon} alt="" src="/vector.svg" />
        </div>
        <div className={styles.orcamento}>
          <div className={styles.header}>
            <div className={styles.detalhesDoOramento}>DESCRIÇÃO</div>
            <div className={styles.razoParent}>
              <div className={styles.detalhesDoOramento}>RAZÃO</div>
            </div>
            <div className={styles.razoParent2}>
            <div className={styles.detalhesDoOramento}>QUANTIDADE</div>
            </div>
            <div className={styles.total}>TOTAL</div>
          </div>
          {itens.map((item, index) => (
            <Item
              key={index}
              itemNome={item.itemNome}
              descricao={item.descricao}
              razao={item.razao}
              quantidade={item.quantidade}
              total={(extrairValor(item.razao) * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            />
        ))}

          <div className={styles.subTotal}>
            <div className={styles.subTotalChild} />
            <div className={styles.frameContainer}>
              <div className={styles.subTotalParent}>
                <div className={styles.frete}>Sub Total</div>
                <div className={styles.r5000000}>
                  {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>              </div>
              <div className={styles.subTotalParent}>
                <div className={styles.frete}>Frete</div>
                <div className={styles.r5000000}>R$ {frete.toFixed(2)}</div>
              </div>
              <div className={styles.subTotalParent}>
                <div className={styles.frete}>Mobilização</div>
                <div className={styles.r5000000}>R$ {deslocamento.toFixed(2)}</div>
              </div>
            </div>
            <div className={styles.lineParent}>
              <div className={styles.subTotalChild} />
              <div className={styles.totalParent}>
                <div className={styles.total1}>TOTAL</div>
                <div className={styles.r5750000}>
                {totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
              <div className={styles.subTotalChild} />
            </div>
          </div>
        </div>
        <div className={styles.frameDiv}>
          <div className={styles.condiesGeraisDeVendaParent}>
            <div className={styles.condiesGeraisDe}>
              Condições Gerais de Venda
            </div>
            <div className={styles.formaDePagamento}>Forma de Pagamento: {formaPagamento}</div>
            <div className={styles.formaDePagamento}>Prazo de Entrega: {prazoEntrega}</div>
          </div>
          <div className={styles.frameChild1} />
          <div className={styles.component1}>
            <div className={styles.div}>(41) 99920-6980</div>
            <div className={styles.deepakparallelconnectcom}>
              jackson@ineditametalurgica.com.br
            </div>
            <div className={styles.wwwparallelconnectcom}>
              www.ineditametalurgica.com.br
            </div>
          </div>
        </div>
      </div>
    </div>      
      </Modal>
      {/* Refatoração do componente A4 para incluir ref={pdfRef} */}

    </div>
  );
};

export default A4;
