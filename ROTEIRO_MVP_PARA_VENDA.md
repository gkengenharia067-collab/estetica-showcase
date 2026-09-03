
---

## Incidente registrado: contamina‡Æo entre projetos (app Wendy x Estetica Showcase)

**O que aconteceu:** um projeto novo (app "Wendy") foi editado dentro da mesma pasta/reposit¢rio do projeto da cl¡nica, em vez de numa pasta e reposit¢rio separados. Commits desse projeto novo foram enviados por engano para o reposit¢rio da cl¡nica, sobrescrevendo o historico correto no GitHub.

**Como foi recuperado:** o historico completo nunca foi perdido de verdade - ficou preservado localmente via `git reflog`, que registra todo movimento do HEAD (resets, commits, checkouts), mesmo o que nao aparece mais no `git log` normal. Localizado o ultimo commit bom conhecido, foi criado um branch novo a partir dele (`git checkout -b restaurado <hash>`), testado localmente, e por fim publicado por cima do `main` remoto com `git push --force origin restaurado:main`.

**Regra para nunca mais acontecer:** cada projeto novo (cada cliente, cada MVP diferente) DEVE ter sua propria pasta local e seu proprio repositorio no GitHub, desde o primeiro commit. Nunca reaproveitar a pasta de um projeto que ja esta em producao/vendido como base rapida para outro projeto. Clonar para uma pasta nova sempre, mesmo que de mais trabalho inicial.

**Se acontecer de novo:** nao entrar em panico, nao commitar nem fazer push de nada antes de investigar. Rodar `git reflog` primeiro, sempre - ele e a rede de seguranca do Git.
