app.factory("load_country_prov_cities", ['services', '$q',
function (services, $q) {
    var service = {};
    service.loadCountry = loadCountry;
    service.loadProvince = loadProvince;
    service.loadCity = loadCity;
    return service;

    function loadCountry() {
        var deferred = $q.defer();
        services.get("users", "load_country_user", true).then(function (data) {
            //console.log(data);
            if (data === 'error') {
                deferred.resolve({ success: false, datas: "error_load_country" });
            } else {
                deferred.resolve({ success: true, datas: data });
                //$.each(data, function (i, valor) {
                    //console.log(valor.sName);
                    //console.log(valor.sISOCode);
                //});
            }
        });
        return deferred.promise;
    };
    
    function loadProvince() {
        var deferred = $q.defer();
        services.get("users", "load_province_user", true).then(function (data) {
            //console.log(data);
            if (data === 'error') {
                deferred.resolve({ success: false, datas: "error_load_province" });
            } else {
                deferred.resolve({ success: true, datas: data.provinces });
                //$.each(data.provincias, function (i, valor) {
                    //console.log(valor.id);
                    //console.log(valor.nombre);
                //});
            }
        });
        return deferred.promise;
    };
    
    function loadCity(datos) {
        var deferred = $q.defer();
        services.post("users", "load_cities_user", datos).then(function (data) {
            //console.log(datos);
            //console.log(data);
            if (data === 'error') {
                deferred.resolve({ success: false, datas: "error_load_cities" });
            } else {
                deferred.resolve({ success: true, datas: data.cities });
                //$.each(data.poblaciones, function (i, valor) {
                    //console.log(valor.poblacion);
                //});
            }
        });
        return deferred.promise;
    };
}]);
