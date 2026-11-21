# TorajoRP — Site de downloads

Site estático compatível com GitHub Pages. Não usa PHP, Node.js no servidor ou banco de dados.

## Estrutura

- `index.html`, `style.css`, `app.js`, `config.js`: site.
- `assets/logo.png`: logo enviada para o projeto.
- `ANDROID/`: coloque aqui os APKs Android.
- `PC/`: coloque aqui os ZIPs para PC.

## Padrão obrigatório dos nomes

O site só mostra arquivos cujos nomes terminam exatamente nestes padrões:

- Android: `TorajoRP-V0.8.0 For android 11-16.apk`
- PC: `TorajoRP-V0.8.0.zip`

A versão deve ter três partes numéricas (`major.minor.patch`). O texto antes de `V` pode variar.

Exemplos válidos:
- `TorajoRP-V1.2.3 For android 11-16.apk`
- `TorajoRP-V0.8.0 For android 11-16.apk`
- `TorajoRP-V1.2.3.zip`

Exemplos inválidos:
- `TorajoRP-V1.2 For android 11-16.apk`
- `TorajoRP-V1.2.3.apk`
- `TorajoRP-V1.2.3 For android 11-16.zip`
- `TorajoRP-V1.2.3.rar`

## Como o site encontra os arquivos

No GitHub Pages padrão (`https://USUARIO.github.io/REPOSITORIO/`), o site detecta automaticamente o usuário e o repositório pela URL e consulta a GitHub Contents API para listar as pastas `ANDROID` e `PC`. Arquivos fora do padrão são ignorados. A versão é extraída do nome do arquivo e exibida como `Versão: x.x.x`.

Se uma pasta não tiver nenhum arquivo válido, a lista mostra `Nenhuma build disponível.`

Se o site estiver em um domínio personalizado, abra `config.js` e preencha `owner` e `repo` com o usuário e o repositório públicos do GitHub. `branch` é opcional; vazio usa a branch padrão do repositório.

## Publicar no GitHub Pages

1. Envie todos os arquivos e pastas deste projeto para a raiz de um repositório GitHub público.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Selecione a branch principal (por exemplo, `main`) e a pasta `/ (root)`.
5. Salve e aguarde o endereço do Pages aparecer.

Depois, basta adicionar novas builds às pastas correspondentes e fazer `git push`. O site detecta os arquivos ao recarregar a página.

**Nota:** a consulta usa a API pública do GitHub e está sujeita ao limite de requisições não autenticadas do GitHub. Para um repositório público com acessos normais, isso costuma ser suficiente.
