using Microsoft.EntityFrameworkCore;
using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Data;

/// <summary>
/// Dados fictícios do catálogo. O primeiro curso reproduz o conteúdo do protótipo do Figma;
/// os demais seguem a mesma estrutura, com cargas horárias, módulos e públicos diferentes.
/// </summary>
public static class SeedData
{
    public static async Task ExecutarAsync(CatalogoDbContext db)
    {
        if (await db.Cursos.AnyAsync()) return;

        var categorias = new Dictionary<string, Categoria>
        {
            ["matematica"] = new() { Slug = "matematica", Nome = "Matemática" },
            ["linguagens"] = new() { Slug = "linguagens", Nome = "Linguagens" },
            ["ciencias-da-natureza"] = new() { Slug = "ciencias-da-natureza", Nome = "Ciências da Natureza" },
            ["sustentabilidade"] = new() { Slug = "sustentabilidade", Nome = "Sustentabilidade" },
        };
        db.Categorias.AddRange(categorias.Values);

        var cursos = new List<Curso>
        {
            MatematicaPrecisao(categorias["matematica"]),
            GeometriaTextil(categorias["matematica"]),
            EstatisticaQualidade(categorias["matematica"]),
            FisicaMovimento(categorias["ciencias-da-natureza"]),
            QuimicaSustentabilidade(categorias["ciencias-da-natureza"]),
            CienciaMateriais(categorias["ciencias-da-natureza"]),
            ComunicacaoTecnica(categorias["linguagens"]),
            ResiduosEconomiaCircular(categorias["sustentabilidade"]),
        };

        foreach (var c in cursos)
            c.BuscaNormalizada = TextoBusca.Normalizar($"{c.NomeCompleto} {c.NomeBreve}");

        db.Cursos.AddRange(cursos);
        await db.SaveChangesAsync();
    }

    private static List<Modulo> Modulos(params (string Titulo, string[] Topicos)[] itens) =>
        itens.Select((m, i) => new Modulo { Ordem = i + 1, Titulo = m.Titulo, Topicos = [.. m.Topicos] }).ToList();

    private static List<Faq> Faqs(params (string P, string R)[] itens) =>
        itens.Select((f, i) => new Faq { Ordem = i + 1, Pergunta = f.P, Resposta = f.R }).ToList();

    private static List<SecaoConteudo> SecoesPadrao(string aulas, string avaliacoes) =>
    [
        new()
        {
            Ordem = 1,
            Titulo = "Aulas online",
            Introducao = "As aulas são organizadas em módulos temáticos e disponibilizadas em formato multimídia, combinando:",
            Itens =
            [
                "Vídeo-aulas com especialistas da área, gravadas em alta qualidade e com recursos visuais que facilitam a compreensão dos conteúdos técnicos.",
                "Materiais complementares como apostilas digitais, infográficos, artigos e estudos de caso.",
                aulas,
                "Acesso multiplataforma, permitindo que os alunos estudem pelo computador, tablet ou celular, a qualquer hora e de qualquer lugar.",
            ],
            Fechamento = "Cada aula é acompanhada de recursos de acessibilidade, como legendas, transcrição de áudio e navegação intuitiva, garantindo inclusão e autonomia para todos os perfis de usuários.",
        },
        new()
        {
            Ordem = 2,
            Titulo = "Provas e Avaliações",
            Introducao = "As avaliações são realizadas diretamente na plataforma, com foco na verificação do aprendizado e na aplicação prática dos conhecimentos adquiridos:",
            Itens =
            [
                "Provas objetivas ao final de cada módulo, com correção automática e feedback imediato.",
                avaliacoes,
                "Avaliação final integradora, que consolida os conteúdos do curso e valida a competência do aluno para atuar com segurança no ambiente industrial.",
            ],
            Fechamento = "Ao concluir o curso e ser aprovado nas avaliações, o aluno recebe um certificado digital reconhecido, que pode ser compartilhado em redes profissionais e utilizado para comprovação de capacitação técnica.",
        },
    ];

    private static List<Faq> FaqsBasicas(string formato, string prazo, string conhecimento) => Faqs(
        ("O curso é totalmente online?", formato),
        ("O curso oferece certificado?", "Sim. Ao concluir todos os módulos e ser aprovado nas avaliações, o aluno recebe um certificado digital de conclusão emitido pelo SESI."),
        ("Quanto tempo tenho para concluir o curso?", prazo),
        ("O curso exige algum conhecimento prévio?", conhecimento),
        ("Há suporte para dúvidas durante o curso?", "Sim. Os alunos podem enviar dúvidas por meio dos fóruns de discussão e dos chats da plataforma. A equipe pedagógica está disponível durante todo o curso."));

    private static Curso MatematicaPrecisao(Categoria categoria) => new()
    {
        NomeCompleto = "Matemática para a Precisão: Medidas e Escalas na Metalurgia",
        NomeBreve = "Matemática para a Precisão",
        Descricao = "Aplicação de grandezas, proporções e escalas em processos de corte, furação e usinagem.",
        Sobre = "Explore nosso curso de Matemática para a Precisão: Medidas e Escalas na Metalurgia, perfeito para quem deseja se destacar nesse campo! Este programa abrangente foi desenvolvido para capacitar profissionais com as habilidades e conhecimentos fundamentais para garantir medições precisas e eficientes no ambiente metalúrgico.",
        Categoria = categoria,
        Modalidade = Modalidade.Online,
        CargaHoraria = 60,
        PublicoAlvo = "Operadores, técnicos e supervisores de produção da indústria metalúrgica.",
        Status = StatusCurso.Disponivel,
        ImagemUrl = "/assets/banner-ava.webp",
        DataDisponibilizacao = new DateOnly(2026, 1, 5),
        Modulos = Modulos(
            ("Introdução à Matemática na Metalurgia", [
                "Conceitos fundamentais de medidas e escalas aplicados à metalurgia.",
                "Importância da precisão nas medições e controle de qualidade.",
                "Panorama das normas e regulamentos no Brasil relacionados à metalurgia."]),
            ("Identificação e Avaliação de Medidas", [
                "Tipos de medidas utilizadas: comprimento, massa, volume e temperatura.",
                "Técnicas de análise de precisão nas medições.",
                "Elaboração de gráficos e tabelas de medidas."]),
            ("Normas e Regulamentações", [
                "Estudo das principais normas aplicáveis à metalurgia (ABNT, ISO, entre outras).",
                "Interpretação e aplicação prática das normas de medição.",
                "Atualizações e impactos legais nas práticas de medição."]),
            ("Instrumentos de Medição", [
                "Tipos de instrumentos utilizados na metalurgia: paquímetros, micrômetros e balanças.",
                "Critérios de seleção, uso e calibração.",
                "Responsabilidades legais de operadores e supervisores."]),
            ("Prevenção de Erros de Medição", [
                "Tipos de erros e incertezas nas medições.",
                "Procedimentos para garantir a precisão e exatidão.",
                "Treinamento prático em técnicas de medição."]),
            ("Ergonomia e Eficiência na Medição", [
                "Princípios ergonômicos aplicados ao uso de instrumentos de medição.",
                "Prevenção de lesões por uso inadequado de ferramentas.",
                "Qualidade de vida no ambiente de trabalho."]),
            ("Análise de Resultados de Medição", [
                "Técnicas de análise de dados de medições.",
                "Elaboração de relatórios e planos de ação para melhorias.",
                "Indicadores de precisão e melhoria contínua."]),
            ("Cultura de Precisão e Comportamento Seguro", [
                "Desenvolvimento de uma cultura organizacional voltada à precisão nas medições.",
                "Comunicação eficaz e liderança em práticas de medição.",
                "Programas de conscientização e engajamento dos colaboradores."]),
            ("Tecnologias Aplicadas à Medição", [
                "Uso de plataformas digitais, sensores e automação na medição de precisão.",
                "Sistemas de gestão de qualidade.",
                "Tendências e inovações no setor metalúrgico."]),
            ("Avaliação Final e Certificação", [
                "Teste de conhecimentos adquiridos sobre medidas e escalas.",
                "Atividades práticas e estudos de caso.",
                "Emissão de certificado digital de conclusão."])),
        Secoes = SecoesPadrao(
            "Atividades interativas, como quizzes, simulações e fóruns de discussão, que promovem o engajamento e a troca de experiências entre os participantes.",
            "Estudos de caso e atividades práticas, que simulam situações reais da indústria e exigem análise crítica e tomada de decisão."),
        Faqs = Faqs(
            ("O curso é totalmente online?", "Sim. Todas as aulas, atividades e avaliações são realizadas pela plataforma digital, permitindo que o aluno estude de onde estiver, no seu próprio ritmo."),
            ("Preciso estar disponível em horários específicos?", "Não. As aulas são gravadas e ficam disponíveis 24 horas por dia. O aluno pode acessar o conteúdo quando for mais conveniente, respeitando os prazos de cada módulo."),
            ("Como são feitas as avaliações?", "As avaliações são realizadas diretamente na plataforma, por meio de provas objetivas, estudos de caso e atividades práticas. Algumas avaliações podem ter tempo limitado e exigem atenção às instruções."),
            ("O curso oferece certificado?", "Sim. Ao concluir todos os módulos e ser aprovado nas avaliações, o aluno recebe um certificado digital de conclusão, válido em todo o território nacional."),
            ("Quem são os professores?", "O corpo docente é formado por especialistas, engenheiros e professores com ampla experiência em metrologia e atuação direta na indústria. Os perfis dos docentes estão disponíveis na plataforma."),
            ("Há suporte para dúvidas durante o curso?", "Sim. Os alunos podem enviar dúvidas por meio dos fóruns de discussão, chats da plataforma ou durante os webinários ao vivo. A equipe pedagógica está disponível para auxiliar durante todo o curso."),
            ("O curso exige algum conhecimento prévio?", "Não é obrigatório, mas é recomendado que o aluno tenha interesse ou alguma familiaridade com o ambiente industrial. O curso foi estruturado para atender tanto iniciantes quanto profissionais em busca de atualização."),
            ("Posso acessar o curso pelo celular?", "Sim. A plataforma é responsiva e compatível com computadores, tablets e smartphones, garantindo uma experiência completa em qualquer dispositivo."),
            ("Quanto tempo tenho para concluir o curso?", "O prazo para conclusão varia conforme o plano escolhido. Em geral, o aluno tem entre 3 a 6 meses para finalizar todos os módulos e avaliações."),
            ("O curso é reconhecido por órgãos oficiais?", "O curso segue as diretrizes das normas técnicas e boas práticas da área, sendo reconhecido como formação complementar. Para certificações oficiais, é necessário verificar os requisitos específicos de cada órgão regulador.")),
    };

    private static Curso GeometriaTextil(Categoria categoria) => new()
    {
        NomeCompleto = "Geometria e Modelagem no Design Têxtil",
        NomeBreve = "Geometria no Design Têxtil",
        Descricao = "Explora formas geométricas, simetria e padrões matemáticos presentes em tecidos e estampas.",
        Sobre = "Descubra como a geometria sustenta a criação de estampas, o encaixe de moldes e o aproveitamento de tecido. O curso une teoria e prática para que o profissional do setor têxtil reduza desperdícios e ganhe precisão na modelagem.",
        Categoria = categoria,
        Modalidade = Modalidade.Presencial,
        CargaHoraria = 40,
        PublicoAlvo = "Modelistas, costureiros industriais e estudantes de moda e design têxtil.",
        Status = StatusCurso.Disponivel,
        ImagemUrl = "/cursos/geometria-textil.svg",
        DataDisponibilizacao = new DateOnly(2026, 2, 9),
        Modulos = Modulos(
            ("Formas e Padrões", [
                "Figuras planas e sólidos na confecção.",
                "Simetria, rotação e translação em estampas.",
                "Leitura de padrões repetitivos em tecidos."]),
            ("Medidas e Proporção", [
                "Escalas de redução e ampliação de moldes.",
                "Proporção áurea e equilíbrio visual.",
                "Cálculo de consumo de tecido."]),
            ("Modelagem Plana", [
                "Construção geométrica de bases de modelagem.",
                "Ângulos, curvas e pences.",
                "Ajustes de molde para diferentes tamanhos."]),
            ("Encaixe e Aproveitamento", [
                "Estratégias de encaixe para reduzir sobras.",
                "Orientação do fio e direção do tecido.",
                "Indicadores de desperdício."]),
            ("Projeto Final", [
                "Desenvolvimento de uma coleção cápsula com padrões geométricos.",
                "Apresentação e avaliação por pares."])),
        Secoes =
        [
            new()
            {
                Ordem = 1,
                Titulo = "Aulas presenciais",
                Introducao = "As aulas acontecem em laboratório de modelagem e combinam exposição, prática guiada e trabalho em grupo:",
                Itens =
                [
                    "Oficinas de traçado de moldes com instrutores do SESI.",
                    "Uso de mesas de corte, réguas e softwares de encaixe.",
                    "Visitas técnicas a unidades produtivas parceiras.",
                ],
                Fechamento = "Todo o material de apoio também fica disponível na plataforma, com recursos de acessibilidade.",
            },
            new()
            {
                Ordem = 2,
                Titulo = "Avaliações",
                Introducao = "O desempenho é acompanhado ao longo do curso, por meio de:",
                Itens =
                [
                    "Exercícios práticos de traçado ao final de cada módulo.",
                    "Projeto final com apresentação para a turma.",
                    "Frequência mínima de 75% nas aulas presenciais.",
                ],
                Fechamento = "Aprovados recebem certificado de conclusão emitido pelo SESI.",
            },
        ],
        Faqs = FaqsBasicas(
            "Não. As aulas são presenciais, em laboratório de modelagem. Os materiais de apoio ficam disponíveis na plataforma digital.",
            "As turmas têm 10 encontros semanais. O aluno precisa de frequência mínima de 75% para ser aprovado.",
            "Não. O curso atende desde iniciantes até profissionais que desejam aprimorar a modelagem."),
    };

    private static Curso EstatisticaQualidade(Categoria categoria) => new()
    {
        NomeCompleto = "Estatística e Controle de Qualidade na Produção",
        NomeBreve = "Estatística na Produção",
        Descricao = "Leitura e interpretação de dados de controle de qualidade e produtividade.",
        Sobre = "Aprenda a transformar dados da linha de produção em decisões. O curso apresenta as principais ferramentas estatísticas do controle de qualidade, de gráficos de controle a capacidade de processo, sempre com exemplos de chão de fábrica.",
        Categoria = categoria,
        Modalidade = Modalidade.Online,
        CargaHoraria = 80,
        PublicoAlvo = "Analistas e inspetores de qualidade, engenheiros de produção e líderes de equipe.",
        Status = StatusCurso.EmBreve,
        ImagemUrl = "/cursos/estatistica-qualidade.svg",
        DataDisponibilizacao = new DateOnly(2026, 11, 16),
        Modulos = Modulos(
            ("Fundamentos de Estatística", [
                "População, amostra e variáveis.",
                "Medidas de tendência central e dispersão.",
                "Distribuição normal."]),
            ("Coleta e Organização de Dados", [
                "Planos de amostragem na produção.",
                "Folhas de verificação e histogramas.",
                "Qualidade dos dados e erros de registro."]),
            ("Gráficos de Controle", [
                "Gráficos X-barra e R.",
                "Gráficos por atributos (p e np).",
                "Interpretação de sinais fora de controle."]),
            ("Capacidade de Processo", [
                "Índices Cp e Cpk.",
                "Especificações e tolerâncias.",
                "Ações de melhoria baseadas na capacidade."]),
            ("Análise de Causas", [
                "Diagrama de Pareto e de Ishikawa.",
                "Correlação e regressão simples.",
                "Plano de ação com 5W2H."]),
            ("Estudo de Caso Integrador", [
                "Análise de uma linha de produção fictícia.",
                "Elaboração de relatório técnico."])),
        Secoes = SecoesPadrao(
            "Planilhas e simulações para praticar a construção de gráficos de controle com dados de produção fictícios.",
            "Análise de bases de dados de produção, com apresentação das conclusões em relatório."),
        Faqs = FaqsBasicas(
            "Sim. Todas as aulas, atividades e avaliações acontecem na plataforma digital, no ritmo do aluno.",
            "O aluno tem até 6 meses, a partir da data de início, para concluir os módulos e as avaliações.",
            "Recomenda-se conhecimento básico de planilhas eletrônicas. A estatística é apresentada desde os fundamentos."),
    };

    private static Curso FisicaMovimento(Categoria categoria) => new()
    {
        NomeCompleto = "Física do Movimento e da Energia na Metalurgia",
        NomeBreve = "Física na Metalurgia",
        Descricao = "Estudo de forças, atrito, calor e energia em máquinas, fornos e prensas.",
        Sobre = "O curso relaciona os conceitos de mecânica e termodinâmica ao dia a dia do operador metalúrgico: por que uma prensa exige determinada força, como o calor se propaga em um forno e onde se perde energia. Combina aulas online e encontros práticos.",
        Categoria = categoria,
        Modalidade = Modalidade.Hibrido,
        CargaHoraria = 60,
        PublicoAlvo = "Operadores de máquinas, técnicos de manutenção e estudantes de cursos técnicos industriais.",
        Status = StatusCurso.Disponivel,
        ImagemUrl = "/cursos/fisica-metalurgia.svg",
        DataDisponibilizacao = new DateOnly(2026, 3, 2),
        Modulos = Modulos(
            ("Movimento e Forças", [
                "Velocidade, aceleração e leis de Newton.",
                "Forças em peças e estruturas.",
                "Equilíbrio e momento de uma força."]),
            ("Atrito e Desgaste", [
                "Atrito estático e cinético.",
                "Lubrificação de máquinas.",
                "Desgaste de ferramentas de corte."]),
            ("Trabalho, Energia e Potência", [
                "Conservação da energia.",
                "Potência de motores e prensas.",
                "Rendimento de máquinas."]),
            ("Calor e Temperatura", [
                "Condução, convecção e radiação.",
                "Dilatação térmica de metais.",
                "Eficiência térmica em fornos."]),
            ("Prática em Laboratório", [
                "Medição de forças e temperaturas.",
                "Experimentos com planos inclinados e dilatação.",
                "Relatório de laboratório."])),
        Secoes =
        [
            new()
            {
                Ordem = 1,
                Titulo = "Aulas online e presenciais",
                Introducao = "O curso combina duas frentes:",
                Itens =
                [
                    "Vídeo-aulas e materiais na plataforma para os módulos teóricos.",
                    "Cinco encontros presenciais de laboratório, aos sábados.",
                    "Fóruns de discussão para troca de experiências entre os alunos.",
                ],
                Fechamento = "Todo o conteúdo conta com legendas, transcrição de áudio e navegação por teclado.",
            },
            new()
            {
                Ordem = 2,
                Titulo = "Avaliações",
                Introducao = "O aluno é avaliado por:",
                Itens =
                [
                    "Provas objetivas online a cada módulo teórico.",
                    "Relatórios dos experimentos realizados em laboratório.",
                    "Avaliação final integradora.",
                ],
                Fechamento = "A aprovação exige nota mínima e presença nos encontros de laboratório.",
            },
        ],
        Faqs = FaqsBasicas(
            "Parcialmente. A teoria é online; os cinco encontros de laboratório são presenciais, aos sábados.",
            "O curso tem duração de 4 meses. O aluno deve concluir os módulos online conforme o calendário e comparecer aos encontros.",
            "É recomendado ter concluído o ensino fundamental. Os conceitos de Física são apresentados desde o início."),
    };

    private static Curso QuimicaSustentabilidade(Categoria categoria) => new()
    {
        NomeCompleto = "Química e Sustentabilidade",
        NomeBreve = "Química e Sustentabilidade",
        Descricao = "Estudo das reações químicas envolvidas na tinturaria e acabamento de tecidos.",
        Sobre = "Entenda as reações químicas por trás dos processos de tingimento e acabamento têxtil e como reduzir o impacto ambiental com dosagens corretas, reaproveitamento de água e substituição de insumos.",
        Categoria = categoria,
        Modalidade = Modalidade.Online,
        CargaHoraria = 30,
        PublicoAlvo = "Profissionais de tinturaria e acabamento, técnicos em química e estudantes da área.",
        Status = StatusCurso.Encerrado,
        ImagemUrl = "/cursos/quimica-sustentabilidade.svg",
        DataDisponibilizacao = new DateOnly(2025, 3, 10),
        Modulos = Modulos(
            ("Reações Químicas na Indústria Têxtil", [
                "Ácidos, bases e pH nos banhos de tingimento.",
                "Reações de oxirredução.",
                "Corantes e fixadores."]),
            ("Dosagem e Eficiência", [
                "Cálculo de concentração de soluções.",
                "Redução de insumos sem perda de qualidade."]),
            ("Água e Efluentes", [
                "Consumo de água por processo.",
                "Tratamento e reúso de efluentes.",
                "Indicadores ambientais."]),
            ("Alternativas Sustentáveis", [
                "Corantes naturais e de baixo impacto.",
                "Certificações ambientais do setor."])),
        Secoes = SecoesPadrao(
            "Simuladores de dosagem e exercícios de cálculo de concentração.",
            "Estudos de caso de tinturarias que reduziram o consumo de água e de insumos."),
        Faqs = FaqsBasicas(
            "Sim. O curso era 100% online. As inscrições estão encerradas e a próxima turma ainda não tem data.",
            "O prazo de conclusão era de 3 meses a partir do início da turma.",
            "Não. Os conceitos de Química necessários são revisados no primeiro módulo."),
    };

    private static Curso CienciaMateriais(Categoria categoria) => new()
    {
        NomeCompleto = "Ciência dos Materiais na Metalurgia",
        NomeBreve = "Ciência dos Materiais",
        Descricao = "Conceitos básicos de estrutura, resistência e propriedades dos metais.",
        Sobre = "Conheça a estrutura interna dos metais e como ela define resistência, dureza e comportamento sob calor. O curso é prático e usa ensaios no laboratório do SESI para ligar a teoria aos materiais usados na indústria.",
        Categoria = categoria,
        Modalidade = Modalidade.Presencial,
        CargaHoraria = 100,
        PublicoAlvo = "Técnicos em metalurgia e mecânica, engenheiros júnior e estudantes de engenharia de materiais.",
        Status = StatusCurso.EmBreve,
        ImagemUrl = "/cursos/ciencia-materiais.svg",
        DataDisponibilizacao = new DateOnly(2026, 12, 7),
        Modulos = Modulos(
            ("Estrutura dos Metais", [
                "Ligações atômicas e redes cristalinas.",
                "Defeitos cristalinos.",
                "Ligas metálicas."]),
            ("Propriedades Mecânicas", [
                "Tração, compressão e cisalhamento.",
                "Dureza e resiliência.",
                "Fadiga e fluência."]),
            ("Tratamentos Térmicos", [
                "Têmpera, revenimento e recozimento.",
                "Diagramas de fases.",
                "Efeito do resfriamento na microestrutura."]),
            ("Aços e Ferros Fundidos", [
                "Classificação dos aços.",
                "Ferros fundidos e suas aplicações.",
                "Seleção de materiais por aplicação."]),
            ("Ensaios Mecânicos", [
                "Ensaio de tração e de dureza.",
                "Ensaio de impacto.",
                "Interpretação de laudos."]),
            ("Corrosão e Proteção", [
                "Tipos de corrosão.",
                "Revestimentos e proteção catódica.",
                "Manutenção preventiva."]),
            ("Projeto Integrador", [
                "Escolha de material para uma peça real.",
                "Defesa técnica diante da banca."])),
        Secoes =
        [
            new()
            {
                Ordem = 1,
                Titulo = "Aulas presenciais",
                Introducao = "As aulas ocorrem no laboratório de materiais, com turmas reduzidas:",
                Itens =
                [
                    "Aulas expositivas com apoio de amostras reais.",
                    "Ensaios de tração, dureza e impacto acompanhados por instrutores.",
                    "Visitas a fundições e unidades de tratamento térmico parceiras.",
                ],
                Fechamento = "O material didático é disponibilizado na plataforma, com recursos de acessibilidade.",
            },
            new()
            {
                Ordem = 2,
                Titulo = "Avaliações",
                Introducao = "A avaliação reúne:",
                Itens =
                [
                    "Provas escritas ao fim de cada módulo.",
                    "Relatórios técnicos dos ensaios.",
                    "Projeto integrador com defesa oral.",
                ],
                Fechamento = "A certificação exige 75% de presença e nota mínima no projeto integrador.",
            },
        ],
        Faqs = FaqsBasicas(
            "Não. O curso é presencial, no laboratório de materiais, com aulas em período integral aos sábados.",
            "As turmas têm duração de 7 meses. A presença mínima exigida é de 75%.",
            "É recomendado conhecimento básico de Matemática e Química do ensino médio."),
    };

    private static Curso ComunicacaoTecnica(Categoria categoria) => new()
    {
        NomeCompleto = "Comunicação Técnica e Leitura de Manuais Industriais",
        NomeBreve = "Comunicação Técnica",
        Descricao = "Leitura, interpretação e redação de manuais, ordens de serviço e relatórios técnicos.",
        Sobre = "Desenvolva a clareza na leitura de manuais e instruções de trabalho e na escrita de ordens de serviço e relatórios. O curso trabalha vocabulário técnico, estrutura de textos e boas práticas para evitar ruídos de comunicação no chão de fábrica.",
        Categoria = categoria,
        Modalidade = Modalidade.Online,
        CargaHoraria = 45,
        PublicoAlvo = "Líderes de equipe, operadores, auxiliares administrativos e jovens aprendizes da indústria.",
        Status = StatusCurso.Disponivel,
        ImagemUrl = "/cursos/comunicacao-tecnica.svg",
        DataDisponibilizacao = new DateOnly(2026, 4, 6),
        Modulos = Modulos(
            ("Leitura de Manuais e Instruções", [
                "Estrutura de um manual técnico.",
                "Símbolos, pictogramas e avisos de segurança.",
                "Estratégias de leitura rápida e atenta."]),
            ("Vocabulário Técnico", [
                "Termos recorrentes na indústria.",
                "Siglas e unidades de medida.",
                "Glossários e padronização."]),
            ("Redação de Ordens de Serviço", [
                "Clareza, objetividade e sequência de passos.",
                "Verbos de ação em instruções.",
                "Erros comuns e como evitá-los."]),
            ("Relatórios Técnicos", [
                "Estrutura de relatórios de ocorrência e de turno.",
                "Uso de tabelas e imagens.",
                "Revisão e correção do texto."]),
            ("Comunicação no Chão de Fábrica", [
                "Passagem de turno.",
                "Comunicação em situações de emergência.",
                "Escuta ativa e feedback."])),
        Secoes = SecoesPadrao(
            "Exercícios de redação com correção comentada e modelos de documentos para consulta.",
            "Produção de uma ordem de serviço e de um relatório técnico, avaliados com rubrica de critérios."),
        Faqs = FaqsBasicas(
            "Sim. O curso é totalmente online e pode ser feito pelo computador ou pelo celular.",
            "O aluno tem até 4 meses para concluir os módulos e as avaliações.",
            "Não. O curso parte do básico e é adequado também a quem está voltando a estudar."),
    };

    private static Curso ResiduosEconomiaCircular(Categoria categoria) => new()
    {
        NomeCompleto = "Gestão de Resíduos e Economia Circular na Indústria",
        NomeBreve = "Resíduos e Economia Circular",
        Descricao = "Classificação, redução e reaproveitamento de resíduos industriais com foco em economia circular.",
        Sobre = "Aprenda a classificar resíduos industriais, montar um plano de gerenciamento e identificar oportunidades de reaproveitamento. O curso apresenta os princípios da economia circular e casos reais de redução de custos e de impacto ambiental.",
        Categoria = categoria,
        Modalidade = Modalidade.Hibrido,
        CargaHoraria = 50,
        PublicoAlvo = "Analistas ambientais, supervisores de produção, técnicos em segurança do trabalho e gestores.",
        Status = StatusCurso.Disponivel,
        ImagemUrl = "/cursos/residuos-economia-circular.svg",
        DataDisponibilizacao = new DateOnly(2026, 5, 4),
        Modulos = Modulos(
            ("Panorama dos Resíduos Industriais", [
                "Tipos e classes de resíduos.",
                "Política Nacional de Resíduos Sólidos.",
                "Responsabilidades da indústria."]),
            ("Plano de Gerenciamento", [
                "Diagnóstico e inventário de resíduos.",
                "Segregação, armazenamento e transporte.",
                "Documentação e indicadores."]),
            ("Redução na Fonte", [
                "Produção mais limpa.",
                "Eficiência no uso de matéria-prima.",
                "Metas de redução."]),
            ("Economia Circular", [
                "Princípios e modelos de negócio circulares.",
                "Reaproveitamento, reciclagem e simbiose industrial.",
                "Casos de empresas brasileiras."]),
            ("Visita Técnica e Projeto", [
                "Visita a uma central de triagem.",
                "Elaboração de um plano de melhoria para a própria empresa."])),
        Secoes =
        [
            new()
            {
                Ordem = 1,
                Titulo = "Aulas online e presenciais",
                Introducao = "O curso combina estudo online com atividades presenciais:",
                Itens =
                [
                    "Vídeo-aulas e materiais complementares na plataforma.",
                    "Uma visita técnica presencial a uma central de triagem de resíduos.",
                    "Fóruns para discussão de casos das empresas dos participantes.",
                ],
                Fechamento = "Todo o conteúdo conta com recursos de acessibilidade, como legendas e transcrição.",
            },
            new()
            {
                Ordem = 2,
                Titulo = "Avaliações",
                Introducao = "A aprovação é baseada em:",
                Itens =
                [
                    "Provas objetivas por módulo, com feedback imediato.",
                    "Plano de melhoria aplicado à realidade da empresa do aluno.",
                    "Participação na visita técnica.",
                ],
                Fechamento = "Aprovados recebem certificado digital emitido pelo SESI.",
            },
        ],
        Faqs = FaqsBasicas(
            "Quase. Os módulos são online, e há uma visita técnica presencial, com data combinada com a turma.",
            "O curso dura 3 meses. A visita técnica é agendada em um sábado, no início do segundo mês.",
            "Não. É útil, mas não obrigatório, ter familiaridade com rotinas de uma indústria."),
    };
}
