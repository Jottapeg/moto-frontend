const API_URL = 'https://moto-backend1.onrender.com/api/v1/usuarios';

async function listarUsuarios() {
  try {
    const resposta = await fetch(API_URL);
    const dados = await resposta.json();
    console.log('Usuários:', dados);
  } catch (erro) {
    console.error('Erro ao buscar usuários:', erro);
  }
}
