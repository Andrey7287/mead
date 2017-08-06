const Vacation = require('../models/vacation.js'),
      VacationInSeasonListener = require('../models/vacationInSeasonListener.js');

Vacation.find((err, vacation)=>{
	if(err) return console.error(err);
	if(vacation.length) return;

	const dataVacation = [{
		name: 'Однодневный тур по реке Худ',
		slug: 'hood-river-day-trip',
		category: 'Однодневный тур',
		sku: 'HR199',
		description: 'Проведите день в плавании по реке Колумбия и насладитесь сваренным по традиционным рецептам пивом на реке Худ!',
		priceInCents: 9995,
		tags: ['однодневный тур','река худ','плавание','виндсерфинг','пивоварни'],
		inSeason: true,
		maximumGuests: 16,
		available: true,
		packagesSold: 0
	},{
		name: 'Отдых в Орегон Коуст',
		slug: 'oregon-coast-getaway',
		category: 'Отдых на выходных',
		sku: 'OC39',
		description: 'Насладитесь океанским воздухом и причудливыми прибрежными городками!',
		priceInCents: 269995,
		tags: ['отдых на выходных','орегон коуст','прогулки по пляжу'],
		inSeason: false,
		maximumGuests: 8,
		available: true,
		packagesSold: 0
	},{
		name: 'Скалолазание в Бенде',
		slug: 'rock-climbing-in-bend',
		category: 'Приключение',
		sku: 'B99',
		description: 'Пощекочите себе нервы горным восхождением на пустынной возвышенности.',
		priceInCents: 289995,
		tags: ['отдых на выходных','бенд','пустынная возвышенность','скалолазание'],
		inSeason: true,
		requiresWaiver: true,
		maximumGuests: 4,
		available: false,
		packagesSold: 0,
		notes: 'Гид по данному туру в настоящий момент восстанавливается после лыжной травмы.'
	}];

	dataVacation.forEach( tour => {
		new Vacation(tour).save();
	});
	
});

exports.vacation = (req, res)=>{
  Vacation.find({available: true}, (err,vacations)=>{
    if(err) console.error(`DB Error: ${err.stack}`);
    let context = {
      vacations: vacations.map(vacation => {
        return {
          sku: vacation.sku,
          name: vacation.name,
          descr: vacation.description,
          price: vacation.getDisplayPrice(),
          inSeason: vacation.inSeason
        }
      }) 
    };
    res.render('vacation', context); 
  });
};

exports.notify = (req,res)=>{
  res.render('notify', {sku: req.query.sku});
};

exports.contest = (req, res) => {
  let date = new Date();
  res.render('vacation-photo', {
    year: date.getFullYear(),
    month: date.getMonth(),
    title: 'Upload yours awesome photos'
  });
}

exports.tourRate = (req, res) => {
  res.render('tours/tours-rate', {
    title: 'tours rate'
  });
}
exports.kwai = (req, res) => {
  res.locals = {
    title: 'Test'
  }
  res.render('tours/kwai', {
    title: 'kwai'
  });
}