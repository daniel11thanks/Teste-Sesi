/**
 * Texto da aula "Boas práticas" exibida no AVA. O conteúdo do protótipo é do curso de Matemática para a
 * Precisão; aqui os trechos que citam o tema foram parametrizados para servir a qualquer curso do catálogo.
 */
export function conteudoDaAula(curso) {
  return {
    boasPraticas: [
      `Se você está interessado em se aprofundar em ${curso.nomeCompleto}, aqui estão algumas dicas para maximizar sua experiência online. Primeiro, crie um espaço de estudo livre de distrações, onde você possa se concentrar totalmente no material.`,
      'Estabeleça uma rotina de estudos, reservando horários específicos para assistir às aulas e realizar as atividades. Além disso, interaja com seus colegas e instrutores nos fóruns e chats disponíveis, pois isso enriquece o aprendizado e ajuda a esclarecer dúvidas. Não se esqueça de revisar o conteúdo regularmente e aplicar os conhecimentos em situações práticas sempre que possível.',
      'Por fim, mantenha-se atualizado sobre as novas técnicas e normas da área, já que ela está sempre evoluindo. Com dedicação e as estratégias corretas, você estará preparado para se destacar no setor!',
    ],
    recomendacoes: [
      `Se você está interessado em se aprofundar nos conteúdos de ${curso.categoria.nome} aplicados à indústria, aqui estão algumas dicas valiosas. Primeiro, escolha um curso que ofereça uma abordagem prática, com aulas que incluam exercícios e estudos de caso. Isso ajudará a entender como aplicar os conceitos na prática. Além disso, verifique se o curso é reconhecido por instituições relevantes, pois isso pode impactar sua formação e carreira.`,
      'Outro aspecto importante é a experiência dos instrutores. Procure cursos que tenham profissionais com experiência no setor, pois eles podem compartilhar insights valiosos que vão além da teoria.',
      'Considere também a carga horária e a flexibilidade do curso. Se você trabalha, um curso que ofereça aulas noturnas ou aos finais de semana pode ser mais conveniente.',
      'Por fim, não se esqueça de se conectar com outros alunos e profissionais da área. Isso pode abrir portas e proporcionar um aprendizado ainda mais enriquecedor. Investir em um bom curso é essencial para garantir precisão e eficiência no trabalho.',
    ],
  }
}
