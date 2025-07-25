import React, { useState, useEffect } from 'react';
import { Container, Title, InputContainer, Button, Input } from './css/index';
import { Description } from './css';
 const LoadChannels = ({setChannels, setLoading, setError,  loading, error}) => {

     const [m3uUrl, setM3uUrl] = useState('');
  

  const loadM3uList = async () => {
    if (!m3uUrl) {
      setError("Por favor, insira a URL da lista M3U.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(m3uUrl);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const text = await response.text();
      const parsedChannels = parseM3u(text); 
      setChannels(parsedChannels);
      localStorage.setItem('iptvM3uUrl', m3uUrl); 
    } catch (err) {
      console.error("Erro ao carregar lista M3U:", err);
      setError(`Falha ao carregar lista: ${err.message}. Verifique a URL.`);
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

    const parseM3u = (m3uContent) => {
      const lines = m3uContent.split('\n');
      const parsed = [];
      let current = {};
  
      for (const line of lines) {
        if (line.startsWith('#EXTINF:')) {
          const nameMatch = line.match(/,(.*)/);
          const logoMatch = line.match(/tvg-logo="([^"]*)"/);
          const groupMatch = line.match(/group-title="([^"]*)"/);
  
          current = {
            name: nameMatch && nameMatch[1] ? nameMatch[1].trim().replace(/\r$/, '') : 'Canal Desconhecido',
            logo: logoMatch ? logoMatch[1] : '',
            group: groupMatch ? groupMatch[1] : 'Outros',
            url: ''
          };
        } else if (line.trim() && !line.startsWith('#')) {
          current.url = line.trim();
          parsed.push(current);
        }
      }
  
      return parsed;
    };
  

      useEffect(() => {
        const savedUrl = localStorage.getItem('iptvM3uUrl');
        if (savedUrl) {
          setM3uUrl(savedUrl);
        
        }
      }, []);
    


    return (

        <Container>
            <Title>Bem-vindo ao IPTVFLIX!</Title>
            <Description>Insira a URL da sua lista de canais M3U:</Description>
            <InputContainer>
                <Input
                    type="text"
                    value={m3uUrl}
                    onChange={(e) => setM3uUrl(e.target.value)}
                    placeholder="Ex: http://seuservidor.com/lista.m3u"
                />
                <Button onClick={loadM3uList} disabled={loading}>
                    {loading ? 'Carregando...' : 'Carregar Canais'}
                </Button>
            </InputContainer>
            {error && <Description className="error-message">{error}</Description>}
        </Container>
    )
}


export {LoadChannels};
