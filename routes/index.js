var express = require('express');
var Q=require('q')
var mysql      = require('mysql');

var connection = mysql.createPool({
  host     : '23.95.37.220',
  user     : 'Mohsen',
  password : 'Mohsen#Db1395@SN',
  database : 'majles9',
});
// var connection = mysql.createPool({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'salamsalar1',
//   database : 'majles9',
// });

function getNamayandeDetails(S_ID){
  var defered = Q.defer();
  // connection.query('SELECT Namayande.*,Namayandegi.*,Shakhs.*,NamayandeHoze.H_Name FROM Namayande JOIN Namayandegi ON Namayande.N_ID=Namayandegi.N_ID JOIN Shakhs ON Namayandegi.S_ID=Shakhs.S_ID JOIN NamayandeHoze ON Namayandegi.N_ID=NamayandeHoze.N_ID WHERE Shakhs.S_ID='+S_ID,defered.makeNodeResolver())
  connection.query('SELECT namayande.*,shakhs.*,hoze.* FROM namayande JOIN shakhs JOIN hoze ON shakhs.`id`=namayande.shakhs_id_fk AND hoze.`name`=namayande.hoze_fk WHERE shakhs.id='+S_ID,defered.makeNodeResolver())    ;
  return defered.promise;
}

exports.shownemayande=function(req, res){
    if (isNaN(req.params.id)){
      res.render('error',{message: "motasefam baradar!!"});
      return;
    }

    Q.all([getNamayandeDetails(req.params.id)]).then(function(results){  
      var namayadneDetails={ 
        mizanetakhir: results[0][0][0].mizanetakhir.toString(),
        tedadegheybat: results[0][0][0].tedadegheybat.toString(),
        naam: results[0][0][0].namonamekhanevadegi,
        S_ID: req.params.id,
        zabana: results[0][0][0].zabana,
        savabegh: results[0][0][0].savabegh,
        sen: 1394-parseInt(results[0][0][0].tavalod),
        makanetavalod: results[0][0][0].makanetavalod,
        tahsilat: results[0][0][0].tahsilat,
        esmepedar: results[0][0][0].esmepedar,
        tedaderay: results[0][0][0].tedad,
        darsaderay: results[0][0][0].darsad,
        hoze: results[0][0][0].hoze_fk,
        total_notgh: results[0][0][0].total_notgh,
        total_soal: results[0][0][0].total_soal,
        total_tazakor: results[0][0][0].total_tazakor,
        total_tarh: results[0][0][0].total_tarh,
        adam: results[0][0][0].adam,
        ostan: results[0][0][0].ostan_name_fk,
        darsad_kamtar_tarh: results[0][0][0].darsad_kamtar_tarh,
        darsad_kamtar_tazakor: results[0][0][0].darsad_kamtar_tazakor,
        darsad_kamtar_soal: results[0][0][0].darsad_kamtar_soal,
        darsad_kamtar_notgh: results[0][0][0].darsad_kamtar_notgh,
        darsad_kamtar_adam: results[0][0][0].darsad_kamtar_adam,
      }
      res.render('NamayndeProfilev3', {namayadneDetails});
    });
}

exports.wordcloud=function(req,res){

  connection.query('select type, weight, word from wordcloud where namayande_id_fk='+req.params.nid,function(err,rows,fields){
  var result={notgh:[],tazakor:[],tarh:[]};
  if (rows.length>0) {
    for( var i in rows)
    {
      var element=rows[i].type;
      result[element].push({text: rows[i].word,size: rows[i].weight});
    }
  };
  res.end(JSON.stringify(result));
  });
  

}
exports.mosharekatPlot=function(req,res){
  connection.query('SELECT cnt, comision_name_fk AS com , total  FROM vw_tarh_count_group_by_namayande_commision WHERE vw_tarh_count_group_by_namayande_commision.namayande_id_fk='+req.params.nid,function(err,rows,fields){
  var result=[];
  for( var i in rows)
  {
    result.push({name:rows[i].com , y: rows[i].cnt, total: rows[i].total});
  }
  res.end(JSON.stringify(result));
  });
}

exports.tazakorPlot=function(req,res){
  connection.query('SELECT count , `name`, total from vw_tazakor_count_group_by_namayande_mokhatab WHERE namayande_id_fk='+req.params.nid,function(err,rows,fields){
  var result=[];
  for( var i in rows)
  {
    result.push({name:rows[i].name , y: rows[i].count, total: rows[i].total});
  }
  res.end(JSON.stringify(result));
  });
}


exports.soalPlot=function(req,res){
  connection.query('SELECT count , `name` , total from vw_soal_count_group_by_namayande_mokhatab WHERE namayande_id_fk='+req.params.nid,function(err,rows,fields){
  var result=[];
  for( var i in rows)
  {
    result.push({name:rows[i].name , y: rows[i].count , total:rows[i].total });
  }
  console.log(req.params.nid);
  res.end(JSON.stringify(result));
  });
}

var convertor={1:"اول",2:"دوم",3:"سوم",4:"چهارم"}

exports.comisionTable=function(req,res){
connection.query('select comision1,comision2,semat, sal from vw_comision_namayande where nid='+req.params.nid,function(err,rows,fields){
  var result=[];
  for( var i in rows)
  {
    result.push({comision1:rows[i].comision1 , comision2: rows[i].comision2 , semat:rows[i].semat,sal:rows[i].sal});
  }

  res.end(JSON.stringify(result));
  });
}


exports.home=function(req, res){
  
  res.render('layout', { title: 'Express'});

}

exports.testBoot=function(req,res){
  res.render('testBoot');
}



exports.jdetails=function(req,res){
    connection.query('SELECT * FROM Jalase LEFT OUTER JOIN (SELECT * FROM TakhirGheibat WHERE TakhirGheibat.N_ID=\'9701760\') As temp On Jalase.Shomare=temp.Jalase order by shomare',function(err,rows,fields){

    var forreturn={name: "دوره نهم",children:[]};
    var i=0;

    var sale1={name:"سال اول",children:[]};
    var bahar1={name:"بهار",fasl:1,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2012,6,21))
        break;
      bahar1.children.push({name:rows[i].shomare,size: 10});

    }
    sale1.children.push(bahar1);
    var tabestan1={name:"تابستان",fasl:2,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2012,9,20))
        break;
      tabestan1.children.push({name:rows[i].shomare,size: 10});



    }
    sale1.children.push(tabestan1);
    var paeez1={name:"پاییز",fasl:3,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2012,12,20))
        break;
      paeez1.children.push({name:rows[i].shomare,size: 10});
    }
    sale1.children.push(paeez1);
    var zemestan1={name:"زمستان",fasl:4,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2013,3,19))
        break;
      zemestan1.children.push({name:rows[i].shomare,size: 10});

    }
    sale1.children.push(zemestan1);
    forreturn.children.push(sale1);



    var sale2={name:"سال دوم",children:[]};
    var bahar2={name:"بهار",fasl:1,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2013,6,21))
        break;
      bahar2.children.push({name:rows[i].shomare,size: 10});

    }
    sale2.children.push(bahar2);
    var tabestan2={name:"تابستان",fasl:2,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2013,9,20))
        break;
      tabestan2.children.push({name:rows[i].shomare,size: 10});



    }
    sale2.children.push(tabestan2);
    var paeez2={name:"پاییز",fasl:3,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2013,12,20))
        break;
      paeez2.children.push({name:rows[i].shomare,size: 10});



    }
    sale2.children.push(paeez2);
    var zemestan2={name:"زمستان",fasl:4,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2014,3,19))
        break;
      zemestan2.children.push({name:rows[i].shomare,size: 10});

    }
    sale2.children.push(zemestan2);
    forreturn.children.push(sale2);




    var sale3={name:"سال سوم",children:[]};
    var bahar3={name:"بهار",fasl:1,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2014,6,21))
        break;
      bahar3.children.push({name:rows[i].shomare,size: 10});

    }
    sale3.children.push(bahar3);
    var tabestan3={name:"تابستان",fasl:2,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2014,9,20))
        break;
      tabestan3.children.push({name:rows[i].shomare,size: 10});



    }
    sale3.children.push(tabestan3);
    var paeez3={name:"پاییز",fasl:3,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2014,12,20))
        break;
      paeez3.children.push({name:rows[i].shomare,size: 10});



    }
    sale3.children.push(paeez3);
    var zemestan3={name:"زمستان",fasl:4,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2015,3,19))
        break;
      zemestan3.children.push({name:rows[i].shomare,size: 10});

    }
    sale3.children.push(zemestan3);
    forreturn.children.push(sale3);






    var sale4={name:"سال چهارم",children:[]};
    var bahar4={name:"بهار",fasl:1,children: []};
    for(i ; rows.length;i++)
    {
      if (rows[i].tarikh > new Date(2015,6,21))
        break;
      bahar4.children.push({name:rows[i].shomare,size: 10});

    }
    sale4.children.push(bahar4);
    // var tabestan4={name:"بهار",children: []};
    // for(i ; rows.length;i++)
    // {
    //   if (rows[i].tarikh > new Date(2015,9,20))
    //     break;
    //   tabestan4.children.push({name:rows[i].shomare,size: 10});

    // }
    // sale4.children.push(tabestan4);
    // var paeez4={name:"بهار",children: []};
    // for(i ; rows.length;i++)
    // {
    //   if (rows[i].tarikh > new Date(2015,12,20))
    //     break;
    //   paeez4.children.push({name:rows[i].shomare,size: 10});



    // }
    // sale4.children.push(paeez4);
    // var zemestan4={name:"بهار",children: []};
    // for(i ; rows.length;i++)
    // {
    //   if (rows[i].tarikh > new Date(2016,3,19))
    //     break;
    //   zemestan4.children.push({name:rows[i].shomare,size: 10});

    // }
    // sale4.children.push(zemestan4);
    forreturn.children.push(sale4);
  res.end(JSON.stringify(forreturn));
  });
}

exports.search=function(req,res){
  connection.query('SELECT s.S_ID, s.namonamekhanevadegi, nh.H_Name FROM Shakhs s, Namayandegi n, NamayandeHoze nh WHERE s.S_ID=n.S_ID and n.N_ID=nh.N_ID AND s.namonamekhanevadegi LIKE \'%'+req.query.q+'%\'' ,function(err,rows,fields){
  var result={items:[]}
  for( var i in rows)
  {
    result.items.push({S_ID:rows[i].S_ID , hoze: rows[i].H_Name, name: rows[i].namonamekhanevadegi});
  }
  res.end(JSON.stringify(result));
  });
}

exports.jalase=function(req,res){
  console.log(req.params.shomarejalase);
  console.log(req.param('sid'));
  res.write("salamsalar1");
}
