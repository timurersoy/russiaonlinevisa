export const checkpointStructure = [
    {
        type: 'air',
        regions: [
            { id: 'altai', points: ['barnaul'] },
            { id: 'arkhangelsk', points: ['arkhangelsk'] },
            { id: 'astrakhan', points: ['astrakhan'] },
            { id: 'belgorod', points: ['belgorod'] },
            { id: 'bryansk', points: ['bryansk'] },
            { id: 'bashkortostan', points: ['ufa'] },
            { id: 'buryatia', points: ['ulanUde'] },
            { id: 'volgograd', points: ['volgograd'] },
            { id: 'dagestan', points: ['makhachkala'] },
            { id: 'sverdlovsk', points: ['yekaterinburg'] },
            { id: 'stavropol', points: ['mineralnye'] },
            { id: 'transbaikal', points: ['chita'] },
            { id: 'irkutsk', points: ['irkutsk'] },
            { id: 'kabardino', points: ['nalchik'] },
            { id: 'kaliningrad', points: ['kaliningrad'] },
            { id: 'kaluga', points: ['kaluga'] },
            { id: 'kamchatka', points: ['petropavlovsk'] },
            { id: 'kemerovo', points: ['kemerovo'] },
            { id: 'krasnodar', points: ['krasnodar', 'sochi'] },
            { id: 'krasnoyarsk', points: ['krasnoyarsk'] },
            { id: 'moscow', points: ['vnukovo', 'domodedovo', 'sheremetyevo', 'zhukovsky'] },
            { id: 'omsk', points: ['omsk'] },
            { id: 'orenburg', points: ['orenburg'] },
            { id: 'komi', points: ['syktyvkar'] },
            { id: 'lipetsk', points: ['lipetsk'] },
            { id: 'murmansk', points: ['murmansk'] },
            { id: 'nizhny', points: ['nizhny'] },
            { id: 'novosibirsk', points: ['novosibirsk'] },
            { id: 'primorsky', points: ['vladivostok'] },
            { id: 'perm', points: ['perm'] },
            { id: 'rostov', points: ['rostov'] },
            { id: 'samara', points: ['samara'] },
            { id: 'saratov', points: ['saratov'] },
            { id: 'spb', points: ['pulkovo'] },
            { id: 'sakhalin', points: ['yuzhno'] },
            { id: 'ossetia', points: ['vladikavkaz'] },
            { id: 'tatarstan', points: ['kazan'] },
            { id: 'tomsk', points: ['tomsk'] },
            { id: 'tyumen', points: ['tyumen'] },
            { id: 'ulyanovsk', points: ['ulyanovsk'] },
            { id: 'chelyabinsk', points: ['chelyabinsk'] },
            { id: 'chuvash', points: ['cheboksary'] },
            { id: 'khabarovsk', points: ['khabarovsk'] },
            { id: 'khakassia', points: ['abakan'] },
            { id: 'chechen', points: ['grozny'] },
            { id: 'chukotka', points: ['anadyr'] },
            { id: 'yaroslavl', points: ['yaroslavl'] }
        ]
    },
    {
        type: 'auto',
        regions: [
            { id: 'altaiRep', points: ['tashanta'] },
            { id: 'buryatia', points: ['kyakhta'] },
            { id: 'kaliningrad', points: ['bagrationovsk', 'gusev', 'mamonovoGrzechotki', 'mamonovoGronovo', 'morskoje', 'pogranichny', 'sovetsk', 'chernyshevskoe'] },
            { id: 'karelia', points: ['vyartsilya', 'lyuttya', 'suoperya'] },
            { id: 'murmansk', points: ['salla'] },
            { id: 'primorye', points: ['poltavka', 'turiyRog'] },
            { id: 'pskov', points: ['burachki', 'kunichina', 'shumilkino', 'ubylinka'] },
            { id: 'spb', points: ['brusnitchnoe', 'ivangorodClosed', 'svetogorsk', 'torfjanovka'] },
            { id: 'ossetia', points: ['verkhnyLars'] },
            { id: 'transbaikal', points: ['solovyovsk', 'starotsurukhaitui', 'zabaykalsk'] }
        ]
    },
    {
        type: 'rail',
        regions: [
            { id: 'buryatia', points: ['naushki'] },
            { id: 'kaliningrad', points: ['mamonovo', 'sovetsk'] },
            { id: 'primorye', points: ['makhalino', 'pogranichnyy', 'khasan'] },
            { id: 'spb', points: ['finlyandskiy'] },
            { id: 'transbaikal', points: ['zabaykalsk'] }
        ]
    },
    {
        type: 'maritime',
        regions: [
            { id: 'kamchatka', points: ['petropavlovskSea'] },
            { id: 'kaliningrad', points: ['kaliningradSea'] },
            { id: 'krasnodar', points: ['sochiSea'] },
            { id: 'magadan', points: ['magadan'] },
            { id: 'murmansk', points: ['kandalaksha', 'murmanskSea'] },
            { id: 'primorye', points: ['vladivostokSea', 'zarubino', 'posiet'] },
            { id: 'spb', points: ['bigPortSpb', 'vysotsk', 'passengerPortSpb'] },
            { id: 'sakhalin', points: ['korsakov'] },
            { id: 'khabarovsk', points: ['nikolayevsk'] }
        ]
    },
    {
        type: 'pedestrian',
        regions: [
            { id: 'spb', points: ['ivangorod'] }
        ]
    },
    {
        type: 'river',
        regions: [
            { id: 'amur', points: ['blagoveshchensk'] },
            { id: 'jewish', points: ['amurzet'] },
            { id: 'khabarovsk', points: ['pokrovka', 'khabarovskRiver'] }
        ]
    }
];
