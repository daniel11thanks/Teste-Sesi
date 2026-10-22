import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

export default function Layout() {
  const { pathname, hash } = useLocation()

  // Navegação entre rotas: volta ao topo, ou rola até a âncora (#sobre etc.) quando houver.
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  // Na página de um curso há uma barra de matrícula fixa; o rodapé ganha espaço extra para não ficar coberto.
  const temBarraFixa = /^\/cursos\/\d+/.test(pathname)

  return (
    <div className={temBarraFixa ? 'com-barra-fixa' : undefined}>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <Header overlay={pathname === '/'} />
      <Outlet />
      <Footer />
    </div>
  )
}
