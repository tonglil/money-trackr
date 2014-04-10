module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
    migration.addColumn(
      'Tabs',
      'paidOn',
      {
        type: DataTypes.DATE,
        allowNull: true
      }
    );
    done();
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    migration.removeColumn('Tabs', 'paidOn');
    done();
  }
};
