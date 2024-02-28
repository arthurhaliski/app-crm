import styles from "./Item.module.css";

const Item = ({ itemNome = "Item", descricao, razao, quantidade, total }) => {
  return (
    <div className={styles.item}>
      <div className={styles.frameParent}>
        <div className={styles.frameGroup}>
          <div className={styles.estruturaMetlicaMezaninoParent}>
            <div className={styles.estruturaMetlica}>{itemNome}</div>
            <div className={styles.descrio}>
              <p className={styles.descrio1}>{descricao}</p>
            </div>
          </div>
          <div className={styles.r2650Pkg}>{razao}</div>
          <div className={styles.r2650Pkg}>{quantidade}</div>
          <div className={styles.r5000000}>{total}</div>
        </div>
        <div className={styles.linhaseparaorcamento} />
      </div>
    </div>
  );
};

export default Item;
