import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    setChargement(true);
    setErreur(null);

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setData(json);
        setChargement(false);
      })
      .catch((err) => {
        // Une requête annulée n'est pas une vraie erreur
        if (err.name === 'AbortError') return;
        setErreur(err);
        setChargement(false);
      });

    // Nettoyage : annule la requête si le composant disparaît
    return () => controller.abort();
  }, [url]);

  return { data, chargement, erreur };
}

export default useFetch;